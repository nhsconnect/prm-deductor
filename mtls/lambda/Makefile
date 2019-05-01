build :
	$(MAKE) -C lambda/mtls_test build

deploy-% : build
	$(MAKE) -C deploy/$*/mtls_test_lambda
