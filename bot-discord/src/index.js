import dotenv from 'dotenv';
dotenv.config();
import { Client, Events, Collection, GatewayIntentBits } from 'discord.js';
import { initCommands } from './initCommands.js';
import * as log from 'nodejs-log-utils';
import { sendError } from './utils/global.js';
import { checkNewEvents } from './checkNewEvents.js';

log.resetLogFile();

const token = process.env.DEV ? process.env.DEV_DISCORD_BOT_TOKEN : process.env.FINAL_DISCORD_BOT_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

await initCommands(client);

client.on('ready', async function() {
    log.success(`${client.user.tag} is ready`);
    checkNewEvents(client);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            await interaction.reply({ content: `No command matching ${interaction.commandName} was found.`, ephemeral: true });
            return;
        }
        try {
            await command.execute(interaction);
        } catch (error) {
            sendError(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    } else if (interaction.isButton()) {
        if (interaction.customId.startsWith("event-register-")) {
            const eventId = interaction.customId.split('-')[2];
            await interaction.reply({ content: `Vous êtes maintenant inscrit pour l'activité n°${eventId} !`, ephemeral: true });
        } else if (interaction.customId.startsWith("event-unregister-")) {
            const eventId = interaction.customId.split('-')[2];
            await interaction.reply({ content: `Vous n'êtes plus inscrit pour l'activité n°${eventId}.`, ephemeral: true });
        }
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId === 'event-create') {
            const titleInput = interaction.fields.getTextInputValue('titleInput');
            const descriptionInput = interaction.fields.getTextInputValue('descriptionInput');
            const startDateInput = interaction.fields.getTextInputValue('startDateInput');
            const durationInput = interaction.fields.getTextInputValue('durationInput');
            console.log({ titleInput, descriptionInput, startDateInput, durationInput });
            try {
                const date = new Date(startDateInput);
                console.log(date);
                console.log(date.toLocaleString());
                await interaction.reply({ content: 'Evènement créé !' });
            } catch (ex) {
                await interaction.deferReply({ content: 'Wrong date format.' });
            }
        }
    }
});

client.login(token);
