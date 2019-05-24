.PNONY : deploy destroy

deploy :
	$(MAKE) -C ecr
	$(MAKE) -C cluster
	$(MAKE) -C mtls_server

destroy :
	$(MAKE) -C mtls_server destroy
	$(MAKE) -C cluster
	$(MAKE) -C ecr

