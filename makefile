.PHONY: fresh-build build up start stop remove logs clean help

DOCKER_FILE_PATH = ./docker/dockerfile
IMAGE_NAME := nestjs-sample-api
IMAGE_TAG := latest
CONTAINER_NAME := nestjs-sample-api
HOST_PORT := 3000
CONTAINER_PORT := 3000
ENV_FILE := .env.prod

fresh-build:
	docker build -f $(DOCKER_FILE_PATH) --no-cache -t $(IMAGE_NAME):$(IMAGE_TAG) .

build:
	docker build -f $(DOCKER_FILE_PATH) -t $(IMAGE_NAME):$(IMAGE_TAG) .

up:
	docker run -d --name $(CONTAINER_NAME) --env-file $(ENV_FILE) -p $(HOST_PORT):$(CONTAINER_PORT) $(IMAGE_NAME):$(IMAGE_TAG)

start:
	docker start $(CONTAINER_NAME)

stop:
	docker stop $(CONTAINER_NAME)

remove:
	docker rm -f $(CONTAINER_NAME)

logs:
	docker logs -f $(CONTAINER_NAME)

clean:
	docker rm -f $(CONTAINER_NAME)
	docker rmi -f $(IMAGE_NAME):$(IMAGE_TAG)

help:
	@echo "Comandos disponíveis:"
	@echo "  fresh-build  : Build completo sem cache"
	@echo "  build        : Build incremental com cache"
	@echo "  up           : Cria e inicia o container"
	@echo "  start        : Inicia o container"
	@echo "  stop         : Para o container"
	@echo "  remove       : Remove o container"
	@echo "  logs         : Mostra logs em tempo real"
	@echo "  clean        : Remove container, imagem e limpa recursos não utilizados"
