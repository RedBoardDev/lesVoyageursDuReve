import { SlashCommandBuilder } from '@discordjs/builders';
import { createEmbed } from '../utils/embed.js';

async function sendInfos(interaction) {
    await interaction.reply({embeds: [createEmbed("Test", "test", "#5f85db", "")] });
}

export let command = {
	data: new SlashCommandBuilder()
		.setName("events")
		.setDescription("Renvoie les prochains évènements instanciés"),
	async execute(interaction) {
        await sendInfos(interaction);
	},
};
