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
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = "${aws_security_group.service_sg.id}"
}

module "alb_service_task" {
  source                    = "git::https://github.com/cloudposse/terraform-aws-ecs-alb-service-task.git?ref=master"
  namespace                 = "prm"
  stage                     = "dev"
  name                      = "mtls_server"
  alb_target_group_arn      = "${aws_lb_target_group.tls.arn}"
  container_definition_json = "${module.container_definition.json}"
  container_name            = "mtls_server"
  container_port            = 4444
  ecs_cluster_arn           = "${data.aws_ecs_cluster.cluster.arn}"
  launch_type               = "FARGATE"
  vpc_id                    = "${data.aws_vpc.vpc.id}"
  security_group_ids        = ["${aws_security_group.service_sg.id}"]
  subnet_ids                = ["${data.aws_subnet_ids.public_subnets.ids}"]
}
