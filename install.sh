cd api
sudo mysql < database.sql
cp .env_example .env
npm i
cd ../bot-discord
cp .env_example .env
npm i