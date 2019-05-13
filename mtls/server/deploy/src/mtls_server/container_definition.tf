module "container_definition" {
  source          = "git::https://github.com/cloudposse/terraform-aws-ecs-container-definition.git?ref=master"
  container_name  = "mtls_server"
  container_image = "327778747031.dkr.ecr.eu-west-2.amazonaws.com/prm/mtls:20190513120344"

  environment = [
    {
      name  = "CA"
      value = "${aws_ssm_parameter.ca.value}"
    },
    {
      name  = "CERT"
      value = "${aws_ssm_parameter.cert.value}"
    },
  ]

  secrets = [
    {
      name      = "KEY"
      valueFrom = "${aws_ssm_parameter.key.arn}"
    },
  ]

  port_mappings = [
    {
      containerPort = 4444
      hostPort      = 4444
      protocol      = "tcp"
    },
  ]

  log_options {
    "awslogs-region"        = "${var.aws_region}"
    "awslogs-group"         = "/aws/fargate/mtls_server-${var.environment}"
    "awslogs-stream-prefix" = "mtls_server"
  }

  readonly_root_filesystem = "true"
}
