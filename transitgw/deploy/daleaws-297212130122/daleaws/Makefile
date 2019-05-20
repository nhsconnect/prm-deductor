.PHONY : deploy plan

deploy : output.json

plan :
	terragrunt plan

output.json : terraform.tfvars ../../src/daleaws/*.tf
	terragrunt apply --terragrunt-non-interactive -no-color -auto-approve
	terragrunt output -no-color -json > output.json
