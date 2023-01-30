#!/bin/bash

if [[ ! -f .env ]]; then
    cp .env_example .env
fi

cd api
sudo mysql < database.sql
npm i
cd ../bot-discord
npm i
