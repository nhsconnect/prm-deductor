resource "aws_ram_resource_share" "tgw" {
    name = "transit"
    allow_external_principals = true

    tags = {
        Name = "transit"
        Environment = "${var.environment}"
    }
}

resource "aws_ram_resource_association" "tgw" {
    resource_arn = "${aws_ec2_transit_gateway.gw.arn}"
    resource_share_arn = "${aws_ram_resource_share.tgw.arn}"
}

resource "aws_ram_principal_association" "daleaws" {
    principal = "297212130122"
    resource_share_arn = "${aws_ram_resource_share.tgw.arn}"
}