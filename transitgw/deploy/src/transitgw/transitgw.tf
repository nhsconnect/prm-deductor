resource "aws_ec2_transit_gateway" "gw" {
    description = "The middleman"
    default_route_table_propagation = "disable"

    tags {
        Name = "middleman"
    }
}

# Associate test-vpc-1
data "aws_vpc" "test-vpc-1" {
    tags {
        Name = "${var.environment}-test-vpc-1"
    }
}

data "aws_subnet_ids" "test-vpc-1-private" {
    vpc_id = "${data.aws_vpc.test-vpc-1.id}"

    tags {
        Name = "${var.environment}-test-vpc-1-private-subnet"
    }
}

resource "aws_ec2_transit_gateway_vpc_attachment" "test-vpc-1" {
    vpc_id = "${data.aws_vpc.test-vpc-1.id}"
    transit_gateway_id = "${aws_ec2_transit_gateway.gw.id}"
    subnet_ids = ["${data.aws_subnet_ids.test-vpc-1-private.ids}"]
    transit_gateway_default_route_table_association = false
    transit_gateway_default_route_table_propagation = false

    tags {
        Name = "${var.environment}-test-vpc-1"
    }
}

# Associate test-vpc-2
data "aws_vpc" "test-vpc-2" {
    tags {
        Name = "${var.environment}-test-vpc-2"
    }
}

data "aws_subnet_ids" "test-vpc-2-private" {
    vpc_id = "${data.aws_vpc.test-vpc-2.id}"

    tags {
        Name = "${var.environment}-test-vpc-2-private-subnet"
    }
}

resource "aws_ec2_transit_gateway_vpc_attachment" "test-vpc-2" {
    vpc_id = "${data.aws_vpc.test-vpc-2.id}"
    transit_gateway_id = "${aws_ec2_transit_gateway.gw.id}"
    subnet_ids = ["${data.aws_subnet_ids.test-vpc-2-private.ids}"]
    transit_gateway_default_route_table_association = false
    transit_gateway_default_route_table_propagation = false

    tags {
        Name = "${var.environment}-test-vpc-2"
    }
}

# Associate opentest network
data "aws_vpc" "network" {
    tags {
        Name = "${var.opentest_vpc_name}"
    }
}

data "aws_subnet_ids" "network-private" {
    vpc_id = "${data.aws_vpc.network.id}"

    tags {
        Name = "${var.opentest_vpc_private_subnet_name}"
    }
}

resource "aws_ec2_transit_gateway_vpc_attachment" "network" {
    vpc_id = "${data.aws_vpc.network.id}"
    transit_gateway_id = "${aws_ec2_transit_gateway.gw.id}"
    subnet_ids = ["${data.aws_subnet_ids.network-private.ids}"]
    transit_gateway_default_route_table_propagation = false

    tags {
        Name = "${var.opentest_vpc_name}"
    }
}

# Associate edge network
resource "aws_ec2_transit_gateway_vpc_attachment" "edge" {
    vpc_id = "${module.edge.vpc_id}"
    transit_gateway_id = "${aws_ec2_transit_gateway.gw.id}"
    subnet_ids = ["${module.edge.private_subnets}"]
    transit_gateway_default_route_table_propagation = false

    tags {
        Name = "${var.environment}-edge"
    }
}