# VPC 1
resource "aws_security_group" "test-vpc-1-sg" {
    name = "${var.environment}-test-vpc-1-sg"
    vpc_id = "${module.testvpc1.vpc_id}"
    description = "Test instance SG"
}

resource "aws_security_group_rule" "test-vpc-1-sg-allow-all-private-inbound" {
    type = "ingress"
    from_port = -1
    to_port = -1
    protocol = "all"
    cidr_blocks = [
        "10.0.0.0/8",
        "172.16.0.0/12",
        "192.168.0.0/16"
    ]
    description = "Allow all inbound traffic from private networks"

    security_group_id = "${aws_security_group.test-vpc-1-sg.id}"
}

resource "aws_security_group_rule" "test-vpc-1-sg-allow-all-outbound" {
    type = "egress"
    from_port = -1
    to_port = -1
    protocol = "all"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"

    security_group_id = "${aws_security_group.test-vpc-1-sg.id}"
}

# VPC 2
resource "aws_security_group" "test-vpc-2-sg" {
    name = "${var.environment}-test-vpc-2-sg"
    vpc_id = "${module.testvpc2.vpc_id}"
    description = "Test instance SG"
}

resource "aws_security_group_rule" "test-vpc-2-sg-allow-all-private-inbound" {
    type = "ingress"
    from_port = -1
    to_port = -1
    protocol = "all"
    cidr_blocks = [
        "10.0.0.0/8",
        "172.16.0.0/12",
        "192.168.0.0/16"
    ]
    description = "Allow all inbound traffic from private networks"

    security_group_id = "${aws_security_group.test-vpc-2-sg.id}"
}

resource "aws_security_group_rule" "test-vpc-2-sg-allow-all-outbound" {
    type = "egress"
    from_port = -1
    to_port = -1
    protocol = "all"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"

    security_group_id = "${aws_security_group.test-vpc-2-sg.id}"
}