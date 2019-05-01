.PHONY : build clean

source = main.js

build : lambda.zip

lambda.zip : prod_dep/node_modules $(source)
	zip -u lambda.zip $(source) || true
	cd prod_dep && zip -u ../lambda.zip node_modules -r || true

prod_dep/node_modules : package.json
	mkdir -p prod_dep
	cp -p package.json package-lock.json prod_dep
	cd prod_dep && npm install --production

clean :
	rm -rf prod_dep lambda.zip
