resource "aws_lb" "nlb" {
  name               = "prm-mtls-server-${var.environment}"
  internal           = false
  load_balancer_type = "network"
  subnets            = ["${data.aws_subnet_ids.public_subnets.ids}"]
}

resource "aws_lb_target_group" "tls" {
  name        = "prm-mtls-server-tls-${var.environment}"
  port        = 4444
  protocol    = "TCP"
  target_type = "ip"
  vpc_id      = "${data.aws_vpc.vpc.id}"
}

resource "aws_lb_listener" "tls" {
  load_balancer_arn = "${aws_lb.nlb.arn}"
  port              = 443
  protocol          = "TCP"

  default_action {
    type             = "forward"
    target_group_arn = "${aws_lb_target_group.tls.arn}"
  }
}
