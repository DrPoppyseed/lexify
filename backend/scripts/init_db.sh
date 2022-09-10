#!/usr/bin/env bash

# Mostly from LukeMathWalker's zero2prod init_db.sh file

set -x
set -eo pipefail

DB_USER="${MYSQL_USER:=root}"
DB_PASSWORD="${MYSQL_PASSWORD:=root}"
DB_NAME="${MYSQL_NAME:=lexify}"
DB_PORT="${MYSQL_PORT:=5432}"
DB_HOST="${MYSQL_HOST:=localhost}"

if [[ -z "${SKIP_DOCKER}" ]]
then
  RUNNING_MYSQL_CONTAINER=$(docker ps --filter 'name=mysql' --format '{{.ID}}')
  if [[ -n $RUNNING_MYSQL_CONTAINER ]]; then
    echo >&2 "there is a mysql container already running, kill it with"
    echo >&2 "    docker kill ${RUNNING_MYSQL_CONTAINER}"
    exit 1
  fi

  docker run \
    -e MYSQL_USER=${DB_USER} \
    -e MYSQL_PASSWORD=${DB_PASSWORD} \
    -e MYSQL_DB=${DB_NAME} \
    -p "${DB_PORT}":5432 \
    -d \
    --name "mysql_$(date '+%s')" \
    mysql -N 1000
fi

>&2 echo "MySQL is up and running on port ${DB_PORT} - running migrations now!"

export DB_URL=mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
diesel setup
diesel migration run

>&2 echo "MySQL has been migrated. Ready to go!"