resource "tls_private_key" "root" {
  algorithm = "RSA"
}

resource "tls_self_signed_cert" "root" {
  key_algorithm   = "RSA"
  private_key_pem = "${tls_private_key.root.private_key_pem}"

  validity_period_hours = 26280
  early_renewal_hours   = 8760

  is_ca_certificate = true

  allowed_uses = [
    "digital_signature",
    "cert_signing",
    "crl_signing",
  ]

  subject {
    common_name  = "Root CA"
    organization = "NHSD"
    locality     = "Leeds"
    country      = "UK"
  }
}

resource "tls_private_key" "intermediate" {
  algorithm = "${tls_private_key.root.algorithm}"
}

resource "tls_cert_request" "intermediate" {
  key_algorithm   = "${tls_private_key.root.algorithm}"
  private_key_pem = "${tls_private_key.intermediate.private_key_pem}"

  subject {
    common_name  = "Intermediate CA"
    organization = "NHSD"
    locality     = "Leeds"
    country      = "UK"
  }
}

resource "tls_locally_signed_cert" "intermediate_ca" {
  cert_request_pem   = "${tls_cert_request.intermediate.cert_request_pem}"
  ca_key_algorithm   = "${tls_private_key.root.algorithm}"
  ca_private_key_pem = "${tls_private_key.root.private_key_pem}"
  ca_cert_pem        = "${tls_self_signed_cert.root.cert_pem}"

  validity_period_hours = 26280

  allowed_uses = [
    "digital_signature",
    "cert_signing",
    "crl_signing",
  ]

  is_ca_certificate = true
}

resource "tls_private_key" "server" {
  algorithm = "${tls_private_key.root.algorithm}"
}

resource "tls_cert_request" "server" {
  key_algorithm   = "${tls_private_key.root.algorithm}"
  private_key_pem = "${tls_private_key.server.private_key_pem}"

  subject {
    common_name  = "Server"
    organization = "NHSD"
    locality     = "Leeds"
    country      = "UK"
  }

  dns_names = ["${aws_lb.nlb.dns_name}"]
}

resource "tls_locally_signed_cert" "server" {
  cert_request_pem = "${tls_cert_request.server.cert_request_pem}"

  ca_key_algorithm   = "${tls_private_key.root.algorithm}"
  ca_private_key_pem = "${tls_private_key.intermediate.private_key_pem}"
  ca_cert_pem        = "${tls_locally_signed_cert.intermediate_ca.cert_pem}"

  validity_period_hours = 17520
  early_renewal_hours   = 8760

  allowed_uses = ["server_auth"]
}

resource "tls_private_key" "client" {
  algorithm = "${tls_private_key.root.algorithm}"
}

resource "tls_cert_request" "client" {
  key_algorithm   = "${tls_private_key.root.algorithm}"
  private_key_pem = "${tls_private_key.client.private_key_pem}"

  subject {
    common_name = "Client"
    organization = "NHSD"
    locality     = "Leeds"
    country      = "UK"
  }
}

resource "tls_locally_signed_cert" "client" {
  cert_request_pem = "${tls_cert_request.client.cert_request_pem}"

  ca_key_algorithm   = "${tls_private_key.root.algorithm}"
  ca_private_key_pem = "${tls_private_key.intermediate.private_key_pem}"
  ca_cert_pem        = "${tls_locally_signed_cert.intermediate_ca.cert_pem}"

  validity_period_hours = 17520
  early_renewal_hours   = 8760

  allowed_uses = ["client_auth"]
}

data "template_file" "trust" {
  template = <<EOT
${tls_locally_signed_cert.intermediate_ca.cert_pem}${tls_self_signed_cert.root.cert_pem}
EOT
}

resource "aws_ssm_parameter" "ca" {
  name        = "/prm/${data.aws_caller_identity.current.account_id}/mtls_server/${var.environment}/ca"
  type        = "String"
  value       = "${data.template_file.trust.rendered}"
  description = "CA trust store for mTLS server"

  overwrite = true
}

resource "aws_ssm_parameter" "key" {
  name        = "/prm/${data.aws_caller_identity.current.account_id}/mtls_server/${var.environment}/key"
  type        = "SecureString"
  value       = "${tls_private_key.server.private_key_pem}"
  description = "Private key for mTLS server"

  overwrite = true
}

resource "aws_ssm_parameter" "cert" {
  name        = "/prm/${data.aws_caller_identity.current.account_id}/mtls_server/${var.environment}/cert"
  type        = "String"
  value       = "${tls_locally_signed_cert.server.cert_pem}"
  description = "Server certificate for mTLS server"

  overwrite = true
}

resource "aws_ssm_parameter" "client_key" {
  name        = "/prm/${data.aws_caller_identity.current.account_id}/mtls_server/${var.environment}/client_key"
  type        = "SecureString"
  value       = "${tls_private_key.client.private_key_pem}"
  description = "Private key for mTLS server"

  overwrite = true
}

resource "aws_ssm_parameter" "client_cert" {
  name        = "/prm/${data.aws_caller_identity.current.account_id}/mtls_server/${var.environment}/client_cert"
  type        = "String"
  value       = "${tls_locally_signed_cert.client.cert_pem}"
  description = "Server certificate for mTLS server"

  overwrite = true
}