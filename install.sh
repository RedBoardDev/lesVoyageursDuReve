cp .env_example .env
cd api
sudo mysql < database.sql
npm i
cd ../bot-discord
npm i