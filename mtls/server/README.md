## Requirements
* Terraform 11.11
* Terragrunt 0.17
* Node, npm
* AWS CLI
* Docker

## Deploying the server
1. Ensure that the lambda was deployed
2. Create the docker image by navigating to *./mtls_endpoint* and running `make`.
3. Create the docker registry by running `make` from *./deploy/dev-327778747031/ecr*.
4. Push the docker image from 2. to the docker registry from 3. by retrieving the token with `$(aws ecr get-login | sed 's/-e none//')` and then pushing it to the registry by running `docker push 327778747031.dkr.ecr.eu-west-2.amazonaws.com/prm/mtls:20190507163200`
5. Deploy the Fargate cluster. From *./deploy/dev-327778747031/cluster*, run `make`.
6. From *./deploy/dev-327778747031/cluster*, run `make` to deploy a container with the docker image from 3. onto the Fargate cluster from 5.