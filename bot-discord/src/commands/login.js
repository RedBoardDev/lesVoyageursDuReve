import { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';

export let command = {
	data: new SlashCommandBuilder()
		.setName("login")
		.setDescription("S'authentifier à son compte Les Voyageurs du Rêve"),
	async execute(interaction) {
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel(`S'authentifier`)
                .setStyle(ButtonStyle.Link)
                .setURL(`http://localhost:8134/login.html?discordId=${interaction.user.id}`),
        );

        await interaction.reply({ content: `Pour vous authentifier, veuillez cliquer sur le bouton suivant`, components: [row], ephemeral: true });
	},
};
