.PHONY : build test clean docker

source = main.js endpoint.js 

build : docker

deploy.zip : prod_dep/node_modules $(source)
	zip -u deploy.zip $(source) || true
	cd prod_dep && zip -u ../deploy.zip node_modules -r || true

prod_dep/node_modules : package.json
	mkdir -p prod_dep
	cp -p package.json package-lock.json prod_dep
	cd prod_dep && npm install --production

node_modules package-lock.json : package.json
	npm install

test : node_modules $(source) test/*.js
	npm test

clean :
	rm -rf node_modules prod_dep deploy.zip

docker : Dockerfile deploy.zip
	docker build -t mtls .
