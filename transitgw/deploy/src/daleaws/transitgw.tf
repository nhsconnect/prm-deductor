data "aws_ec2_transit_gateway" "transitgw" {
    filter {
        name = "owner-id"
        values = ["327778747031"]
    }
}

data "aws_vpc" "default" {
    default = true
}

data "aws_subnet_ids" "default" {
    vpc_id = "${data.aws_vpc.default.id}"
}

data "aws_route_table" "default" {
    vpc_id = "${data.aws_vpc.default.id}"
}

resource "aws_ec2_transit_gateway_vpc_attachment" "default" {
  subnet_ids         = ["${data.aws_subnet_ids.default.ids}"]
  transit_gateway_id = "${data.aws_ec2_transit_gateway.transitgw.id}"
  vpc_id             = "${data.aws_vpc.default.id}"
  transit_gateway_default_route_table_association = false
  transit_gateway_default_route_table_propagation = false

  lifecycle {
      ignore_changes = [
          "transit_gateway_default_route_table_association",
          "transit_gateway_default_route_table_propagation"
      ]
  }

  tags {
      Name = "daleaws"
      Remote = "dev-327778747031"
  }
}

resource "aws_route" "transit" {
    route_table_id = "${data.aws_route_table.default.id}"
    destination_cidr_block = "192.168.128.0/24"
    transit_gateway_id = "${data.aws_ec2_transit_gateway.transitgw.id}"
}