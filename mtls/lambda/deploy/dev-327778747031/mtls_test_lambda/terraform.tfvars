terragrunt = {
  terraform {
    source = "../../src//mtls_test_lambda"
  }

  remote_state {
    backend = "s3"
    config {
      bucket = "prm-327778747031-terraform-states"
      key = "dev/mtls_test_lambda/terraform.tfstate"
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
# Path has 5 extra .. components in as Terragrunt copies the modules into a cache in several sub-directories of this directory
lambda_zip = "../../../../../../../lambda/mtls_test/lambda.zip"