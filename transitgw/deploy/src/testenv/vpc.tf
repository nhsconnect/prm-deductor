locals {
    test_env_1_private_subnets = ["10.2.1.0/24", "10.2.2.0/24", "10.2.3.0/24"]
    test_env_2_private_subnets = ["10.3.1.0/24", "10.3.2.0/24", "10.3.3.0/24"]
}

module "testvpc1" {
    source  = "terraform-aws-modules/vpc/aws"
    version = "1.60.0"

    name = "${var.environment}-test-vpc-1"
    cidr = "10.2.0.0/16"

    azs             = ["${var.availability_zones}"]
    private_subnets = "${slice(local.test_env_1_private_subnets, 0, length(var.availability_zones))}"

    private_subnet_tags = {
        Name = "${var.environment}-test-vpc-1-private-subnet"
    }

    enable_nat_gateway   = false
    enable_dns_hostnames = true
    enable_dns_support   = true

    tags = {
        Environment = "${var.environment}"
        Component   = "test-vpc-1"
    }
}

module "testvpc2" {
    source  = "terraform-aws-modules/vpc/aws"
    version = "1.60.0"

    name = "${var.environment}-test-vpc-2"
    cidr = "10.3.0.0/16"

    azs             = ["${var.availability_zones}"]
    private_subnets = "${slice(local.test_env_2_private_subnets, 0, length(var.availability_zones))}"

    private_subnet_tags = {
        Name = "${var.environment}-test-vpc-2-private-subnet"
    }

    enable_nat_gateway     = false
    enable_dns_hostnames   = true
    enable_dns_support     = true

    tags = {
        Environment = "${var.environment}"
        Component   = "test-vpc-2"
    }
}