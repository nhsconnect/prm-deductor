locals {
    public_subnets = ["10.1.1.0/24", "10.1.2.0/24", "10.1.3.0/24"]
    private_subnets = ["10.1.4.0/24", "10.1.5.0/24", "10.1.6.0/24"]
}

module "edge" {
    source  = "terraform-aws-modules/vpc/aws"
    version = "1.60.0"

    name = "${var.environment}-edge"
    cidr = "10.1.0.0/16"

    azs             = ["${var.availability_zones}"]
    public_subnets = "${slice(local.public_subnets, 0, length(var.availability_zones))}"
    private_subnets = "${slice(local.private_subnets, 0, length(var.availability_zones))}"

    public_subnet_tags = {
        Name = "${var.environment}-edge-public-subnet"
    }

    private_subnet_tags = {
        Name = "${var.environment}-edge-private-subnet"
    }

    enable_nat_gateway   = true
    single_nat_gateway   = true
    one_nat_gateway_per_az = false

    nat_gateway_tags     = {
        Name = "${var.environment}-edge-nat-gw"
    }

    enable_dns_hostnames = true
    enable_dns_support   = true

    tags = {
        Environment = "${var.environment}"
        Component   = "edge"
    }
}
