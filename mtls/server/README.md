## Requirements
* Terraform 11.11
* Terragrunt 0.17
* Node, npm
* AWS CLI
* Docker
* cURL
* jq

## Deploying the server
1. Ensure that the lambda was deployed
2. Create the docker image by navigating to *./mtls_endpoint* and running `make`.
3. Create the docker registry by running `make` from *./deploy/dev-327778747031/ecr*.
4. Push the docker image from 2. to the docker registry from 3. by retrieving the token with `$(aws ecr get-login | sed 's/-e none//')` and then pushing it to the registry by running `docker push 327778747031.dkr.ecr.eu-west-2.amazonaws.com/prm/mtls:<tag>`
5. Deploy the Fargate cluster. From *./deploy/dev-327778747031/cluster*, run `make`.
6. From *./deploy/dev-327778747031/cluster*, run `make` to deploy a container with the docker image from 4. onto the Fargate cluster from 5.
7. Update *./deploy/src/mtls_server/container_definition.tf* to reference the image pushed in 4.
8. From *./deploy/dev-327778747031/mtls_server*, run `make` to deploy the container into the Fargate cluster created in 5.

## Testing the server
The client certificates for mTLS are stored in SSM Parameter Store, retrieve by:
1. `aws ssm get-parameter --name '/prm/327778747031/mtls_server/dev/ca' --query 'Paraqmeter.Value' --with-decryption --output text > trust.pem`
2. `aws ssm get-parameter --name '/prm/327778747031/mtls_server/dev/client_cert' --query 'Paraqmeter.Value' --with-decryption --output text > client.crt`
3. `aws ssm get-parameter --name '/prm/327778747031/mtls_server/dev/client_key' --query 'Paraqmeter.Value' --with-decryption --output text > client.key`

To test the server:
1. `export SERVER_URL=$(terragrunt output -json | jq -r .mtls_server_url.value)`
2. `curl -v --cacert trust.pem --cert client.crt --key client.key https://$SERVER_URL`
