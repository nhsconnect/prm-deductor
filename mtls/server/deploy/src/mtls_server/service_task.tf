data "aws_ecs_cluster" "cluster" {
  cluster_name = "prm-${data.aws_caller_identity.current.account_id}-mtls-cluster-${lower(var.environment)}"
}

resource "aws_security_group" "service_sg" {
  vpc_id      = "${data.aws_vpc.vpc.id}"
  name        = "prm-${data.aws_caller_identity.current.account_id}-mtls-server-${lower(var.environment)}"
  description = "Security group for mTLS server"
}

resource "aws_security_group_rule" "allow_https" {
  type              = "ingress"
  from_port         = 4444
  to_port           = 4444
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = "${aws_security_group.service_sg.id}"
}

module "alb_service_task" {
  source                         = "git::https://github.com/subnova-nhs/terraform-aws-ecs-alb-service-task.git?ref=master"
  namespace                      = "prm"
  stage                          = "dev"
  name                           = "mtls_server"
  alb_target_group_arn           = "${aws_lb_target_group.tls.arn}"
  assign_public_ip               = true
  container_definition_json      = "${module.container_definition.json}"
  container_name                 = "mtls_server"
  container_port                 = 4444
  ecs_cluster_arn                = "${data.aws_ecs_cluster.cluster.arn}"
  launch_type                    = "FARGATE"
  vpc_id                         = "${data.aws_vpc.vpc.id}"
  security_group_ids             = ["${aws_security_group.service_sg.id}"]
  subnet_ids                     = ["${data.aws_subnet_ids.public_subnets.ids}"]
  ignore_changes_task_definition = "false"
}

data "aws_iam_policy_document" "ssm" {
  statement {
    actions = [
      "ssm:GetParameters",
    ]

    resources = [
      "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/prm/${data.aws_caller_identity.current.account_id}/mtls_server/${var.environment}/*",
    ]
  }
}

data "aws_iam_policy_document" "lambda" {
  statement {
    actions = [
      "lambda:InvokeFunction"
    ]

    resources = [
      "arn:aws:lambda:${var.aws_region}:${data.aws_caller_identity.current.account_id}:function:mtls-test-${var.environment}",
    ]
  }
}

resource "aws_iam_role_policy" "ssm" {
  name = "ssm"
  role = "${module.alb_service_task.exec_role_id}"

  policy = "${data.aws_iam_policy_document.ssm.json}"
}

resource "aws_iam_role_policy" "lambda" {
  name    = "lambda"
  role    = "${module.alb_service_task.task_role_id}"
  policy  = "${data.aws_iam_policy_document.lambda.json}"
}

resource "aws_cloudwatch_log_group" "log" {
  name = "/aws/fargate/mtls_server-${var.environment}"
}
