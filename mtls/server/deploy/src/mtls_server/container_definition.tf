module "container_definition" {
  source          = "git::https://github.com/cloudposse/terraform-aws-ecs-container-definition.git?ref=master"
  container_name  = "mtls-server"
  container_image = "327778747031.dkr.ecr.eu-west-2.amazonaws.com/prm/mtls:${var.docker_tag}"
  container_cpu   = 224

  environment = [
    {
      name  = "CA"
      value = "${aws_ssm_parameter.ca.value}"
    },
    {
      name  = "CERT"
      value = "${aws_ssm_parameter.cert.value}"
    },
    {
      name = "LAMBDA"
      value = "mtls-test-${var.environment}"
    },
    {
      name  = "AWS_XRAY_DEBUG_MODE",
      value = "TRUE"
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
    "awslogs-group"         = "/aws/fargate/mtls-server-${var.environment}"
    "awslogs-stream-prefix" = "mtls-server"
  }

  readonly_root_filesystem = "true"
}

module "xray_daemon_definition" {
  source          = "git::https://github.com/cloudposse/terraform-aws-ecs-container-definition.git?ref=master"
  container_name  = "xray-daemon"
  container_image = "amazon/aws-xray-daemon:latest"
  container_cpu   = 32

  port_mappings = [
    {
      containerPort = 2000
      protocol      = "udp"
    },
  ],

  log_options {
    "awslogs-region"        = "${var.aws_region}"
    "awslogs-group"         = "/aws/fargate/mtls-server-${var.environment}"
    "awslogs-stream-prefix" = "xray-daemon"
  }
}