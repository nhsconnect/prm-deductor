test :
	$(MAKE) -C lambda/test test

build :
	$(MAKE) -C lambda/test build

deploy-% : build
	$(MAKE) -C deploy/$*/test_lambda
