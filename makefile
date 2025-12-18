.PHONY: fresh-build build up start stop remove logs clean help

BASE := docker-compose -f docker/docker-compose.prod.yml

fresh-build:
	$(BASE) build --no-cache

build:
	$(BASE) build

up:
	$(BASE) up -d

start:
	$(BASE) start

stop:
	$(BASE) stop

down:
	$(BASE) down

logs:
	$(BASE) logs -f

clean:
	$(BASE) down -v --remove-orphans

help:
	@echo "Comandos disponíveis:"
	@echo "  fresh-build  : Build completo sem cache"
	@echo "  build        : Build incremental com cache"
	@echo "  up           : Cria e inicia os containers"
	@echo "  stop         : Para os containers"
	@echo "  start        : Inicia os containers"
	@echo "  down         : Remove containers e redes"
	@echo "  logs         : Mostra logs em tempo real"
	@echo "  clean        : Limpa todos os recursos"
