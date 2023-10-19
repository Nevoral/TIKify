# Define a default target
.PHONY: default
default: generate

# Define the target to run 'templ generate'
.PHONY: generate
generate:
	templ generate
	go run cmd/TIKify/main.go
