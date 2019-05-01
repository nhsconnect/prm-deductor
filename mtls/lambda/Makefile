.PHONY : build terratest

build :
	$(MAKE) -C lambda/mtls_test build

terratest : build
	$(MAKE) -C deploy/test/mtls_test_lambda

deploy-% : build
	$(MAKE) -C deploy/$*/mtls_test_lambda
