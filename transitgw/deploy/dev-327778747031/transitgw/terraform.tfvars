terragrunt = {
  terraform {
    source = "../../src//transitgw"
  }

  remote_state {
    backend = "s3"
    config {
      bucket = "prm-327778747031-terraform-states"
      key = "dev/transitgw/terraform.tfstate"
      region = "eu-west-2"
      encrypt = true
    }
  }
}

# ---------------------------------------------------------------------------------------------------------------------
# MODULE PARAMETERS
# These are the variables we have to pass in to use the module specified in the terragrunt configuration above
# ---------------------------------------------------------------------------------------------------------------------

aws_region = "eu-west-2"
environment = "dev"
availability_zones = ["eu-west-2a", "eu-west-2b", "eu-west-2c"]
opentest_vpc_name = "dev-network"
opentest_vpc_private_subnet_name = "dev-private-subnet"
opentest_gw_sg = "opentest-dev-ec2"
