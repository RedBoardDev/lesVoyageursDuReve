import { loadDataJson, writeDataJson } from './utils/global.js';
import { createEventEmbed } from './utils/embed.js';
import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';
import { executeDBRequest } from './utils/api.js';

const asyncSleep = (t) => new Promise(resolve => setTimeout(resolve, t));

async function sendNewEvent(client, channelId, eventData) {
    const channel = await client.channels.fetch(channelId);
    const embed = await createEventEmbed(eventData);
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`event-register-${eventData.id}`)
                .setLabel(`S'inscrire`)
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`event-unregister-${eventData.id}`)
                .setLabel(`Se désinscrire`)
                .setStyle(ButtonStyle.Danger)
        );

    await channel.send({ content: "**Nouvel évènement !**\n_Cliquez sur le titre pour accéder à la page de l'évènement_", embeds: [embed], components: [row] });
}

export async function checkNewEvents(client) {
    while (true) {
        const data = await loadDataJson();
        executeDBRequest('GET', '/event/all', process.env.API_TOKEN).then(async (res) => {
            const lastEvent = res.data.slice(-1)[0];
            if (lastEvent && data.lastEventSent !== lastEvent.id) {
                await sendNewEvent(client, process.env.ANNOUNCEMENTS_CHANNEL, lastEvent);
                data.lastEventSent = lastEvent.id;
                writeDataJson(data);
            }
        }).catch((err) => {
        });
        await asyncSleep(30000);
    }
}
