.PHONY : deploy destroy

deploy :
	$(MAKE) -C testenv
	$(MAKE) -C transitgw

destroy :
	$(MAKE) -C transitgw destroy
	$(MAKE) -C testenv destroy

