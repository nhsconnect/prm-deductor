resource "aws_dx_gateway" "dxgw" {
    name = "hscn-gw"
    amazon_side_asn = "65000"
}

resource "aws_dx_gateway_association" "edge" {
  dx_gateway_id  = "${aws_dx_gateway.dxgw.id}"
  vpn_gateway_id = "${module.edge.vgw_id}"

  allowed_prefixes = [
    "10.2.0.0/16",
    "10.3.0.0/16",
  ]
}