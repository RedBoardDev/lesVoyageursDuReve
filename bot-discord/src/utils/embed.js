import dateFormat from "dateformat";
import { EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { getEventTypeColor, getEventTypeName, getUser } from '../utils/api.js';

export function createEmbed(title, description, color, testUrl) {
    const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setTimestamp()
    // .setThumbnail('attachment://epitechmoulibot_logo.png')
    .setColor(color)
    .setFooter({ text: 'Les voyageurs du rêve', /* iconURL: 'attachment://myepitech_logo.png' */ });
    if (testUrl !== "")
        embed.setURL(testUrl);
    return (embed);
}

export async function createEventEmbed(eventData) {
    const title = eventData.title;
    const description = eventData.description;
    const eventColor = await getEventTypeColor(eventData);
    const eventType = await getEventTypeName(eventData);
    const createdBy = (await getUser(eventData.admin_user_id))?.username;
    const startDate = dateFormat(new Date(eventData.date_start), "dd/mm/yyyy HH:MM");
    const endDate = dateFormat(new Date(eventData.date_end), "dd/mm/yyyy HH:MM");
    const eventId = eventData.id.toString();

    return createEmbed(title, description, eventColor ?? '#000000', `${process.env.API_URL}/event.html?id=${eventId}`).addFields(
        { name: 'Type', value: eventType ?? '', inline: true },
        { name: 'Créé par', value: createdBy ?? '', inline: true },
        { name: 'Date début', value: startDate, inline: true },
        { name: 'Date fin', value: endDate, inline: true },
        { name: 'ID', value: eventId, inline: true }
    );
}
