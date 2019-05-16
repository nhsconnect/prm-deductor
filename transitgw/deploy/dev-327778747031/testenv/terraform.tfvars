terragrunt = {
  terraform {
    source = "../../src//testenv"
  }

  remote_state {
    backend = "s3"
    config {
      bucket = "prm-327778747031-terraform-states"
      key = "dev/testenv/terraform.tfstate"
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
