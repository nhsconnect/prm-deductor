resource "aws_ec2_transit_gateway_route_table" "test-vpc-1" {
    transit_gateway_id = "${aws_ec2_transit_gateway.gw.id}"

    tags {
        Name = "test-vpc-1"
    }
}

resource "aws_ec2_transit_gateway_route_table" "test-vpc-2" {
    transit_gateway_id = "${aws_ec2_transit_gateway.gw.id}"

    tags {
        Name = "test-vpc-2"
    }
}

resource "aws_ec2_transit_gateway_route_table_association" "test-vpc-1" {
    transit_gateway_attachment_id  = "${aws_ec2_transit_gateway_vpc_attachment.test-vpc-1.id}"
    transit_gateway_route_table_id = "${aws_ec2_transit_gateway_route_table.test-vpc-1.id}"
}

resource "aws_ec2_transit_gateway_route_table_association" "test-vpc-2" {
    transit_gateway_attachment_id  = "${aws_ec2_transit_gateway_vpc_attachment.test-vpc-2.id}"
    transit_gateway_route_table_id = "${aws_ec2_transit_gateway_route_table.test-vpc-2.id}"
}

resource "aws_ec2_transit_gateway_route" "test-vpc-1-to-opentest" {
    destination_cidr_block = "192.168.128.0/24"
    transit_gateway_attachment_id = "${aws_ec2_transit_gateway_vpc_attachment.network.id}"
    transit_gateway_route_table_id = "${aws_ec2_transit_gateway_route_table.test-vpc-1.id}"
}

resource "aws_ec2_transit_gateway_route" "test-vpc-2-to-opentest" {
    destination_cidr_block = "192.168.128.0/24"
    transit_gateway_attachment_id = "${aws_ec2_transit_gateway_vpc_attachment.network.id}"
    transit_gateway_route_table_id = "${aws_ec2_transit_gateway_route_table.test-vpc-2.id}"
}

resource "aws_ec2_transit_gateway_route" "opentest-to-test-vpc-1" {
    destination_cidr_block = "10.2.0.0/16"
    transit_gateway_attachment_id = "${aws_ec2_transit_gateway_vpc_attachment.test-vpc-1.id}"
    transit_gateway_route_table_id = "${aws_ec2_transit_gateway.gw.association_default_route_table_id}"
}

resource "aws_ec2_transit_gateway_route" "opentest-to-test-vpc-2" {
    destination_cidr_block = "10.3.0.0/16"
    transit_gateway_attachment_id = "${aws_ec2_transit_gateway_vpc_attachment.test-vpc-2.id}"
    transit_gateway_route_table_id = "${aws_ec2_transit_gateway.gw.association_default_route_table_id}"
}