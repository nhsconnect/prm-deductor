output "completed" {
  value = "${uuid()}"
}

output "repo_url" {
  value = "${aws_ecr_repository.repo.repository_url}"
}
