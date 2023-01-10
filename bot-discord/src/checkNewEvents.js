import { loadDataJson, writeDataJson } from './utils/global.js';
import { createEmbed } from './utils/embed.js';
import { ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';

const asyncSleep = (t) => new Promise(resolve => setTimeout(resolve, t));

async function sendNewEvent(client, channelId, gameTitle, color, createdBy, date, duration, id, url) {
    const channel = await client.channels.fetch(channelId);
    const embed = createEmbed('Nouvel évènement !', gameTitle, color, url);
    embed.addFields(
        { name: 'Créé par', value: createdBy, inline: true },
        { name: 'Date', value: date, inline: true },
        { name: 'Durée', value: duration, inline: true },
        { name: 'ID', value: id.toString(), inline: true }
    )
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`event-register-1`)
                .setLabel(`S'inscrire`)
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`event-unregister-1`)
                .setLabel(`Se désinscrire`)
                .setStyle(ButtonStyle.Danger),
        );

    await channel.send({ embeds: [embed], components: [row] });
}

export async function checkNewEvents(client) {
    while (true) {
        let data = await loadDataJson();
        const lastCreatedEvent = 1; //TODO changer ça par les vraies infos venant de l'api
        if (data.lastEventSent !== lastCreatedEvent) {
            data.lastEventSent = lastCreatedEvent;
            console.log(data);
            await sendNewEvent(client, '1062011025488101399', 'Game title', '#00ff00', 'Moi', '10/01/2023, 18:00', '1h', lastCreatedEvent, ''); //TODO changer ça par les vraies infos venant de l'api
            writeDataJson(data);
        }
        await asyncSleep(30000);
    }
}
