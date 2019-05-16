terraform {
  backend "s3" {}
}

provider "aws" {
  version = "2.10.0"
  region  = "${var.aws_region}"
}
