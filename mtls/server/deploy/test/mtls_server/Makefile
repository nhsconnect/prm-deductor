.PHONY : test clean

test : vendor *.go
	go test -timeout 1000s

vendor : Gopkg.toml
	dep ensure

clean :
	go clean