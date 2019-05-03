data "aws_caller_identity" "current" {}

data "aws_vpc" "vpc" {
  tags {
    Name = "${lower(var.environment)}-network"
  }
}

data "aws_subnet_ids" "public_subnets" {
  vpc_id = "${data.aws_vpc.vpc.id}"

  tags {
    Name = "${lower(var.environment)}-public-subnet"
  }
}
