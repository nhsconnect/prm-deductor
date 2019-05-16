.PHONY : deploy

deploy : output.json

output.json : terraform.tfvars ../../src/transitgw/*.tf
	terragrunt apply --terragrunt-non-interactive -no-color -auto-approve
	terragrunt output -no-color -json > output.json
