import dotenv from 'dotenv';
dotenv.config();
import { REST, Routes } from 'discord.js';
import * as fs from 'node:fs';
import { loadConfigJson } from './src/utils/global.js';
import * as log from 'nodejs-log-utils';

const config = await loadConfigJson();

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = config.client_id;
const guildId = config.server_id;

const commands = [];
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = await import(`./src/commands/${file}`);
	commands.push(command.command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		log.info(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		log.info(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		log.error(error.message);
	}
})();
