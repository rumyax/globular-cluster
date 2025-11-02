docker compose --env-file "./data/server.env" rm --stop --force
docker compose --env-file "./data/server.env" down --rmi "all"
docker compose --env-file "./data/server.env" build
docker compose --env-file "./data/server.env" up --detach
