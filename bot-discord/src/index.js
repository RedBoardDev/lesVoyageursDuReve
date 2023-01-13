import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'node:path';
const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config( {"path" : path.join(__dirname, "../../.env" ) });

import { Client, Events, Collection, GatewayIntentBits } from 'discord.js';
import { initCommands } from './initCommands.js';
import * as log from 'nodejs-log-utils';
import { sendError } from './utils/global.js';
import { checkNewEvents } from './checkNewEvents.js';
import { executeDBRequest, getEventType, getUser } from './utils/api.js';


log.resetLogFile();

const token = process.env.DISCORD_BOT_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

await initCommands(client);

client.on('ready', async function() {
    log.success(`${client.user.tag} is ready`);
    checkNewEvents(client);
});

async function registerUser(interaction) {
    const eventId = interaction.customId.split('-')[2];
    const discordUserId = interaction.user.id;
    const dbUserId = (await getUser(discordUserId))?.id;

    if (!dbUserId) {
        await interaction.reply({ content: "Votre compte **Les voyageurs du rève** n'est pas lié à discord, veuillez taper `/login` puis vous connecter sur le lien qui vous est envoyé pour lier votre compte", ephemeral: true });
        return;
    }
    executeDBRequest('PUT', `/event/register/${eventId}`, process.env.API_TOKEN, {
        user: dbUserId.toString()
    }).then(async (res) => {
        await interaction.reply({ content: `Vous êtes maintenant inscrit pour l'activité n°${eventId} !`, ephemeral: true });
    }).catch(async (err) => {
        console.log(err);
        await interaction.reply({ content: `Erreur lors de votre inscription à l'évènement n°${eventId} !`, ephemeral: true });
    });
}

async function unregisterUser(interaction) {
    const eventId = interaction.customId.split('-')[2];
    const discordUserId = interaction.user.id;
    const dbUserId = (await getUser(discordUserId))?.id;

    if (!dbUserId) {
        await interaction.reply({ content: "Votre compte **Les voyageurs du rève** n'est pas lié à discord, veuillez taper `/login` puis vous connecter sur le lien qui vous est envoyé pour lier votre compte", ephemeral: true });
        return;
    }
    executeDBRequest('PUT', `/event/unregister/${eventId}`, process.env.API_TOKEN, {
        user: dbUserId.toString()
    }).then(async (res) => {
        await interaction.reply({ content: `Vous n'êtes maintenant plus inscrit pour l'activité n°${eventId}.`, ephemeral: true });
    }).catch(async (err) => {
        await interaction.reply({ content: `Erreur lors de votre désinscription à l'évènement n°${eventId} !`, ephemeral: true });
    });
}

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
        if (interaction.customId.startsWith("event-register-"))
            registerUser(interaction);
        else if (interaction.customId.startsWith("event-unregister-"))
            unregisterUser(interaction);
    } else if (interaction.isModalSubmit()) {
        // if (interaction.customId === 'event-create') {
        //     const titleInput = interaction.fields.getTextInputValue('titleInput');
        //     const descriptionInput = interaction.fields.getTextInputValue('descriptionInput');
        //     const startDateInput = interaction.fields.getTextInputValue('startDateInput');
        //     const durationInput = interaction.fields.getTextInputValue('durationInput');
        //     try {
        //         const date = new Date(startDateInput);
        //         await interaction.reply({ content: 'Evènement créé !' });
        //     } catch (ex) {
        //         await interaction.reply({ content: 'Wrong date format.' });
        //     }
        // }
    }
});

client.login(token);
