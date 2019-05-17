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

variable "opentest_vpc_name" {
  description = "The name assigned to the opentest VPC"
}

variable "opentest_vpc_private_subnet_name" {
  description = "The name assigned to the opentest VPC private subnets"
}

variable "opentest_gw_sg" {
  description = "The name of the security group used for the opentest gw"
}