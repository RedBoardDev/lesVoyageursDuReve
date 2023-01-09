import { EmbedBuilder, AttachmentBuilder } from 'discord.js';

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
