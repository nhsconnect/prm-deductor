#!/bin/sh

set -e

# Define where to store the generated certs and metadata.
DIR="$(pwd)/test/tls"

# Optional: Ensure the target directory exists and is empty.
rm -rf "${DIR}"

mkdir -p "${DIR}/root"
mkdir -p "${DIR}/root/newcerts"
mkdir -p "${DIR}/root/crl"
mkdir -p "${DIR}/root/certs"
touch "${DIR}/root/index.txt"
touch "${DIR}/root/index.txt.attr"
echo "1000" > "${DIR}/root/serial"

mkdir -p "${DIR}/intermediate"
mkdir -p "${DIR}/intermediate/newcerts"
mkdir -p "${DIR}/intermediate/crl"
mkdir -p "${DIR}/intermediate/certs"
touch "${DIR}/intermediate/index.txt"
touch "${DIR}/intermediate/index.txt.attr"
echo "1000" > "${DIR}/intermediate/crlnumber"
echo "1234" > "${DIR}/intermediate/serial"

cat > "${DIR}/root/openssl.cnf" << EOF
[req]
default_bits = 2048
encrypt_key  = no # Change to encrypt the private key using des3 or similar
default_md   = sha256
prompt       = no
utf8         = yes

# Speify the DN here so we aren't prompted (along with prompt = no above).
distinguished_name = req_distinguished_name

# Extensions for SAN IP and SAN DNS
req_extensions = v3_req

# Be sure to update the subject to match your organization.
[req_distinguished_name]
C  = UK
L  = Leeds
O  = NHSD
CN = Root CA

# Allow client and server auth. You may want to only allow server auth.
# Link to SAN names.
[v3_req]
basicConstraints     = CA:FALSE
subjectKeyIdentifier = hash
keyUsage             = digitalSignature, keyEncipherment
extendedKeyUsage     = clientAuth, serverAuth

[v3_ca]
# Extensions for a typical CA (`man x509v3_config`).
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[v3_intermediate_ca]
# Extensions for a typical intermediate CA (`man x509v3_config`).
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true, pathlen:0
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[policy_strict]
# The root CA should only sign intermediate certificates that match.
# See the POLICY FORMAT section of `man ca`.
countryName             = match
localityName            = match
organizationName        = match
organizationalUnitName  = optional
commonName              = supplied

[ca]
default_ca    = CA_root

[CA_root]
dir           = "${DIR}/root"
new_certs_dir = "${DIR}/root/newcerts"
database      = "${DIR}/root/index.txt"
serial        = "${DIR}/root/serial"
crl_dir       = "${DIR}/root/crl"
certs         = "${DIR}/root/certs"
private_key   = "${DIR}/root/ca.key"
certificate   = "${DIR}/root/ca.crt"
default_md    = sha256
policy        = policy_strict
EOF

cat > "${DIR}/intermediate/openssl.cnf" << EOF
[req]
default_bits = 2048
encrypt_key  = no # Change to encrypt the private key using des3 or similar
default_md   = sha256
prompt       = no
utf8         = yes

# Speify the DN here so we aren't prompted (along with prompt = no above).
distinguished_name = req_distinguished_name

# Extensions for SAN IP and SAN DNS
req_extensions = v3_req

# Be sure to update the subject to match your organization.
[req_distinguished_name]
C  = UK
L  = Leeds
O  = NHSD
CN = Intermediate CA

# Allow client and server auth. You may want to only allow server auth.
# Link to SAN names.
[v3_req]
basicConstraints     = CA:FALSE
subjectKeyIdentifier = hash
keyUsage             = digitalSignature, keyEncipherment
extendedKeyUsage     = clientAuth, serverAuth

[mtls]
# Extensions for server certificates (`man x509v3_config`).
basicConstraints = CA:FALSE
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer:always
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth, serverAuth
subjectAltName       = @alt_names

[alt_names]
DNS.1 = localhost

[policy_strict]
countryName             = match
localityName            = match
organizationName        = match
organizationalUnitName  = optional
commonName              = supplied

[ca]
default_ca    = CA_intermediate

[CA_intermediate]
dir            = "${DIR}/intermediate"
new_certs_dir  = "${DIR}/intermediate/newcerts"
database       = "${DIR}/intermediate/index.txt"
serial         = "${DIR}/intermediate/serial"
crl_dir        = "${DIR}/intermediate/crl"
certs          = "${DIR}/intermediate/certs"
private_key    = "${DIR}/intermediate/intermediate.key"
certificate    = "${DIR}/intermediate/intermediate.crt"
default_md     = sha256
policy         = policy_strict
email_in_dn    = false
EOF

# Create the certificate authority (CA). This will be a self-signed CA, and this
# command generates both the private key and the certificate. You may want to 
# adjust the number of bits (4096 is a bit more secure, but not supported in all
# places at the time of this publication). 
#
# To put a password on the key, remove the -nodes option.
#
# Be sure to update the subject to match your organization.
echo "Creating root CA"

openssl req \
  -config "${DIR}/root/openssl.cnf" \
  -new \
  -x509 \
  -extensions v3_ca \
  -newkey rsa:2048 \
  -keyout "${DIR}/root/ca.key" \
  -out "${DIR}/root/ca.crt" \
  -nodes \
  -days 120 \
  -set_serial 0

# Create the intermediate certificate authority (CA).
echo "Creating intermediate CA"

openssl req \
  -new \
  -newkey rsa:2048 \
  -nodes \
  -keyout "${DIR}/intermediate/intermediate.key" \
  -out "${DIR}/intermediate/intermediate.csr" \
  -subj "/C=UK/L=Leeds/O=NHSD/CN=Intermediate CA"

openssl ca \
  -config "${DIR}/root/openssl.cnf" \
  -extensions v3_intermediate_ca \
  -days 120 \
  -in "${DIR}/intermediate/intermediate.csr" \
  -out "${DIR}/intermediate/intermediate.crt"

cat "${DIR}/intermediate/intermediate.crt" "${DIR}/root/ca.crt" > "${DIR}/trust.pem"

#
# For each server/service you want to secure with your CA, repeat the
# following steps:
#

# Generate a CSR using the configuration and the key just generated. We will
# give this CSR to our CA to sign.
echo "Create Server certificate"

openssl req \
  -new \
  -newkey rsa:2048 \
  -keyout "${DIR}/server.key" \
  -out "${DIR}/server.csr" \
  -nodes \
  -subj "/C=UK/L=Leeds/O=NHSD/CN=Server"

# # Sign the CSR with our CA. This will generate a new certificate that is signed
# # by our CA.
openssl ca \
  -config "${DIR}/intermediate/openssl.cnf" \
  -extensions mtls \
  -days 120 \
  -in "${DIR}/server.csr" \
  -out "${DIR}/server.crt"

# Generate a CSR using the configuration and the key just generated. We will
# give this CSR to our CA to sign.
echo "Create Client system certificate"

openssl req \
  -new \
  -keyout "${DIR}/client.key" \
  -newkey rsa:2048 \
  -out "${DIR}/client.csr" \
  -nodes \
  -subj "/C=UK/L=Leeds/O=NHSD/CN=Client"

# # Sign the CSR with our CA. This will generate a new certificate that is signed
# # by our CA.
openssl ca \
  -config "${DIR}/intermediate/openssl.cnf" \
  -extensions mtls \
  -days 120 \
  -in "${DIR}/client.csr" \
  -out "${DIR}/client.crt"
