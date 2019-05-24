terragrunt = {
  terraform {
    source = "../../src//vpn"
  }

  remote_state {
    backend = "s3"
    config {
      bucket = "prm-327778747031-terraform-states"
      key = "dev/vpn/terraform.tfstate"
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
ami_id = "ami-053e8bbda53bdd8db"