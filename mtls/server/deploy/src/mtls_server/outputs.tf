output "completed" {
  value = "${uuid()}"
}

output "mtls_server_url" {
  value = "https://${aws_lb.nlb.dns_name}"
}
