#!/bin/bash

./kill.sh

screen -dmS bot
screen -S bot -X stuff 'cd bot-discord\n'
screen -S bot -X stuff 'npm start\n'
echo "bot starting..."

screen -dmS api
screen -S api -X stuff 'cd api\n'
screen -S api -X stuff 'npm start\n'
echo "api starting..."

echo -e "\033[1;32mLaunch done\033[0m"
