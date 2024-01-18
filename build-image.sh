#!/usr/bin/env bash

VERSION=${1:-"1.0"}

docker build . -t counttv/front:$VERSION