import dateFormat from "dateformat";
import { loadDataJson, writeDataJson } from './utils/global.js';
import { createEmbed } from './utils/embed.js';
import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';
import { executeDBRequest, getEventType, getUser } from './utils/api.js';
import { loadConfigJson } from './utils/global.js';

const config = await loadConfigJson();
const asyncSleep = (t) => new Promise(resolve => setTimeout(resolve, t));

async function sendNewEvent(client, channelId, title, description, color, createdBy, startDate, endDate, id, url) {
    const channel = await client.channels.fetch(channelId);
    const embed = createEmbed(title, description, color, url);
    embed.addFields(
        { name: 'Créé par', value: createdBy, inline: true },
        { name: 'Date début', value: dateFormat(new Date(startDate), "dd/mm/yyyy HH:MM"), inline: true },
        { name: 'Date fin', value: dateFormat(new Date(endDate), "dd/mm/yyyy HH:MM"), inline: true },
        { name: 'ID', value: id.toString(), inline: true }
    )
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`event-register-${id}`)
                .setLabel(`S'inscrire`)
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`event-unregister-${id}`)
                .setLabel(`Se désinscrire`)
                .setStyle(ButtonStyle.Danger),
        );

    await channel.send({ content: "**@everyon Nouvel évènement !**\n_Cliquez sur le titre pour accéder à la page de l'évènement_", embeds: [embed], components: [row] });
}

async function getEventTypeColor(lastEvent) {
    if (lastEvent.game_type_id === -1) {
        return '#000000';
    } else {
        return (await getEventType(lastEvent.game_type_id)).color;
    }
}

async function getEventTypeName(lastEvent) {
    if (lastEvent.game_type_id === -1) {
        return lastEvent.game_type_custom;
    } else {
        return (await getEventType(lastEvent.game_type_id)).name;
    }
}

export async function checkNewEvents(client) {
    while (true) {
        const data = await loadDataJson();
        executeDBRequest('GET', '/event/all', process.env.API_TOKEN).then(async (res) => {
            const lastEvent = res.data.slice(-1)[0];
            // console.log(lastEvent);
            if (data.lastEventSent !== lastEvent.id) {
                await sendNewEvent(
                    client,
                    '1062011025488101399',
                    lastEvent.title,
                    await getEventTypeName(lastEvent),
                    await getEventTypeColor(lastEvent),
                    (await getUser(lastEvent.admin_user_id)).username,
                    lastEvent.date_start,
                    lastEvent.date_end,
                    lastEvent.id,
                    `${config.api_url}/event.html?id=${lastEvent.id}`
                );
                data.lastEventSent = lastEvent.id;
                writeDataJson(data);
            }
        }).catch((err) => {
            console.log(err);
        });
        await asyncSleep(30000);
    }
}
