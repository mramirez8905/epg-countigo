#!/usr/bin/env bash

export NAME=${1:?}
export DOCKER_IMAGE=${2:?}
export FRONT_PORT=${3:?}
export BACKEND_HOST=${4:?}
export BACKEND_PORT=${5:?}
export PLAY_STOP_BASE_URL=${6:?}
export NEXT_PUBLIC_BASE_URL=${7:?}
export COUNTV_NETWORK=${8:?}

docker-compose -f front.yml config > docker-compose.yml
docker-compose -p ${NAME}-web down
docker-compose -p ${NAME}-web up -d --remove-orphans