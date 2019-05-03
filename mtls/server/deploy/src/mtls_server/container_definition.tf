data "aws_ssm_parameter" "ca" {
  name = "/prm/${data.aws_caller_identity.current.account_id}/mtls_server/${var.environment}/ca"
}

data "aws_ssm_parameter" "cert" {
  name = "/prm/${data.aws_caller_identity.current.account_id}/mtls_server/${var.environment}/cert"
}

data "aws_ssm_parameter" "key" {
  name            = "/prm/${data.aws_caller_identity.current.account_id}/mtls_server/${var.environment}/key"
  with_decryption = false
}

module "container_definition" {
  source          = "git::https://github.com/cloudposse/terraform-aws-ecs-container-definition.git?ref=master"
  container_name  = "mtls_server"
  container_image = "327778747031.dkr.ecr.eu-west-2.amazonaws.com/prm/mtls:20190501171125"

  environment = [
    {
      name  = "CA"
      value = "${data.aws_ssm_parameter.ca.value}"
    },
    {
      name  = "CERT"
      value = "${data.aws_ssm_parameter.cert.value}"
    },
  ]

  secrets = [
    {
      name      = "KEY"
      valueFrom = "${data.aws_ssm_parameter.key.arn}"
    },
  ]

  port_mappings = [
    {
      containerPort = 4444
      hostPort      = 4444
      protocol      = "tcp"
    },
  ]
}