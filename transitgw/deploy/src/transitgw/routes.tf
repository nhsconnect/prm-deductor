# Test VPC 1 and 2 Routes
resource "aws_ec2_transit_gateway_route_table" "vpc-outbound" {
    transit_gateway_id = "${aws_ec2_transit_gateway.gw.id}"

    tags {
        Name = "vpc-outbound"
    }
}

data "aws_ec2_transit_gateway_vpc_attachment" "daleaws" {
    filter {
        name = "vpc-id"
        values = ["vpc-a8dda2c1"]
    }

    filter {
        name = "state"
        values = ["available"]
    }
}

resource "aws_ec2_transit_gateway_route_table_association" "test-vpc-1" {
    transit_gateway_attachment_id  = "${aws_ec2_transit_gateway_vpc_attachment.test-vpc-1.id}"
    transit_gateway_route_table_id = "${aws_ec2_transit_gateway_route_table.vpc-outbound.id}"
}

resource "aws_ec2_transit_gateway_route_table_association" "test-vpc-2" {
    transit_gateway_attachment_id  = "${aws_ec2_transit_gateway_vpc_attachment.test-vpc-2.id}"
    transit_gateway_route_table_id = "${aws_ec2_transit_gateway_route_table.vpc-outbound.id}"
}

resource "null_resource" "disassociate-transit-gateway-route-table-daleaws" {
    triggers {
        attachment_id = "${data.aws_ec2_transit_gateway_vpc_attachment.daleaws.id}"
    }

    provisioner "local-exec" {
        command = "aws ec2 disassociate-transit-gateway-route-table --transit-gateway-route-table-id ${aws_ec2_transit_gateway.gw.association_default_route_table_id} --transit-gateway-attachment-id ${data.aws_ec2_transit_gateway_vpc_attachment.daleaws.id}"
    }
}

resource "aws_ec2_transit_gateway_route_table_association" "daleaws" {
    transit_gateway_attachment_id = "${data.aws_ec2_transit_gateway_vpc_attachment.daleaws.id}"
    transit_gateway_route_table_id = "${aws_ec2_transit_gateway_route_table.vpc-outbound.id}"
    depends_on = ["null_resource.disassociate-transit-gateway-route-table-daleaws"]
}

resource "aws_ec2_transit_gateway_route" "vpc-to-opentest" {
    destination_cidr_block = "192.168.128.0/24"
    transit_gateway_attachment_id = "${aws_ec2_transit_gateway_vpc_attachment.network.id}"
    transit_gateway_route_table_id = "${aws_ec2_transit_gateway_route_table.vpc-outbound.id}"
}

resource "aws_ec2_transit_gateway_route_table_propagation" "opentest" {
    transit_gateway_attachment_id = "${aws_ec2_transit_gateway_vpc_attachment.network.id}"
    transit_gateway_route_table_id = "${aws_ec2_transit_gateway_route_table.vpc-outbound.id}"
}

resource "aws_ec2_transit_gateway_route" "vpc-to-edge" {
    destination_cidr_block = "0.0.0.0/0"
    transit_gateway_attachment_id = "${aws_ec2_transit_gateway_vpc_attachment.edge.id}"
    transit_gateway_route_table_id = "${aws_ec2_transit_gateway_route_table.vpc-outbound.id}"
}

# VPC1 to Transit
data "aws_route_tables" "test-vpc-1-private" {
    vpc_id = "${data.aws_vpc.test-vpc-1.id}"

    tags {
        Network = "private"
    }
}

resource "aws_route" "test-vpc-1-private-to-transit" {
    count = "${length(data.aws_route_tables.test-vpc-1-private.ids)}"
    route_table_id = "${data.aws_route_tables.test-vpc-1-private.ids[count.index]}"
    destination_cidr_block = "0.0.0.0/0"
    transit_gateway_id = "${aws_ec2_transit_gateway.gw.id}"
}

# VPC2 to Transit
data "aws_route_tables" "test-vpc-2-private" {
    vpc_id = "${data.aws_vpc.test-vpc-2.id}"

    tags {
        Network = "private"
    }
}

resource "aws_route" "test-vpc-2-private-to-transit" {
    count = "${length(data.aws_route_tables.test-vpc-2-private.ids)}"
    route_table_id = "${data.aws_route_tables.test-vpc-2-private.ids[count.index]}"
    destination_cidr_block = "0.0.0.0/0"
    transit_gateway_id = "${aws_ec2_transit_gateway.gw.id}"
}

# Default Routes

resource "aws_ec2_transit_gateway_route_table_propagation" "test-vpc-1" {
    transit_gateway_attachment_id = "${aws_ec2_transit_gateway_vpc_attachment.test-vpc-1.id}"
    transit_gateway_route_table_id = "${aws_ec2_transit_gateway.gw.association_default_route_table_id}"
}

resource "aws_ec2_transit_gateway_route_table_propagation" "test-vpc-2" {
    transit_gateway_attachment_id = "${aws_ec2_transit_gateway_vpc_attachment.test-vpc-2.id}"
    transit_gateway_route_table_id = "${aws_ec2_transit_gateway.gw.association_default_route_table_id}"
}

resource "aws_ec2_transit_gateway_route_table_propagation" "daleaws-vpc" {
    transit_gateway_attachment_id = "${data.aws_ec2_transit_gateway_vpc_attachment.daleaws.id}"
    transit_gateway_route_table_id = "${aws_ec2_transit_gateway.gw.association_default_route_table_id}"
}

# OpenTest to Transit
data "aws_route_tables" "network-private" {
    vpc_id = "${data.aws_vpc.network.id}"

    tags {
        Name = "dev-network-private-eu-west-2a"
    }
}

resource "aws_route" "network-private-to-transit" {
    count = "${length(data.aws_route_tables.network-private.ids)}"
    route_table_id = "${data.aws_route_tables.network-private.ids[count.index]}"
    destination_cidr_block = "10.0.0.0/8"
    transit_gateway_id = "${aws_ec2_transit_gateway.gw.id}"
}

resource "aws_route" "network-private-to-transit-2" {
    count = "${length(data.aws_route_tables.network-private.ids)}"
    route_table_id = "${data.aws_route_tables.network-private.ids[count.index]}"
    destination_cidr_block = "172.31.0.0/16"
    transit_gateway_id = "${aws_ec2_transit_gateway.gw.id}"
}

# Edge to Transit
resource "aws_route" "edge-public-to-transit" {
    count = "${length(module.edge.public_route_table_ids)}"
    route_table_id = "${module.edge.public_route_table_ids[count.index]}"
    destination_cidr_block = "10.0.0.0/8"
    transit_gateway_id = "${aws_ec2_transit_gateway.gw.id}"
}

resource "aws_route" "edge-private-to-transit" {
    count = "${length(module.edge.private_route_table_ids)}"
    route_table_id = "${module.edge.private_route_table_ids[count.index]}"
    destination_cidr_block = "10.0.0.0/8"
    transit_gateway_id = "${aws_ec2_transit_gateway.gw.id}"
}
