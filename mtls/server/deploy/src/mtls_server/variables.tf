variable "aws_region" {
  description = "The region in which the infrastructure will be deployed"
}

variable "environment" {
  description = "The name of the environment being deployed"
}

variable "docker_tag" {
  description = "The tag of the mtls_server docker image to deploy"
}