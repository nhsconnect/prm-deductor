.PHONY : deploy destroy

deploy : output.json

output.json : terraform.tfvars ../../src/ecr/*
	terragrunt apply --terragrunt-non-interactive -no-color -auto-approve
	terragrunt output -no-color -json > output.json

destroy :
	terragrunt destroy --terragrunt-non-interactive -no-color -auto-approve
	rm -f output.json

