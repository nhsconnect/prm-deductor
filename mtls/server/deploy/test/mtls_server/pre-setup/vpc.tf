locals {
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "${var.environment}-network"
  cidr = "10.0.0.0/16"

  azs             = ["${var.availability_zones}"]
  public_subnets  = "${slice(local.public_subnets, 0, length(var.availability_zones))}"

  public_subnet_tags = {
    Name = "${var.environment}-public-subnet"
  }

  enable_nat_gateway   = false

  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Environment = "${var.environment}"
    Component   = "network"
  }
}