data "aws_caller_identity" "current" {}

resource "aws_ecs_cluster" "cluster" {
  name = "prm-${data.aws_caller_identity.current.account_id}-mtls-cluster-${lower(var.environment)}"
}
