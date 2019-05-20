terragrunt = {
  terraform {
    source = "../../src//daleaws"
  }

  remote_state {
    backend = "s3"
    config {
      bucket = "daleaws-297212130122-terraform-states"
      key = "dev/daleaws/terraform.tfstate"
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
