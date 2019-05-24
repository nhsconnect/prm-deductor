.PHONY : deploy plan destroy

deploy : output.json

plan :
	terragrunt plan

output.json : terraform.tfvars ../../src/transitgw/*.tf
	terragrunt apply --terragrunt-non-interactive -no-color -auto-approve
	terragrunt output -no-color -json > output.json

destroy :
	terragrunt destroy --terragrunt-non-interactive -no-color -auto-approve
	rm -f output.json
