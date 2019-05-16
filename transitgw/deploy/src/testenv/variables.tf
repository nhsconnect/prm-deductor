variable "aws_region" {
  description = "The region in which the infrastructure will be deployed"
}

variable "environment" {
  description = "The name of the environment being deployed"
}

variable "availability_zones" {
  description = "The availability zones to use for the test VPCs"
  type = "list"
}