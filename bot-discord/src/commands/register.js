import { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';

export let command = {
	data: new SlashCommandBuilder()
		.setName("register")
		.setDescription("Créer un compte compte Les Voyageurs du Rêve"),
	async execute(interaction) {
        const row = new ActionRowBuilder()
        .addComponents(new ButtonBuilder()
            .setLabel(`Créer un compte`)
            .setStyle(ButtonStyle.Link)
            .setURL(`https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley`),
        );
        await interaction.reply({ content: `Pour vous créer un compte, veuillez cliquer sur le bouton suivant`, components: [row], ephemeral: true });
	},
};
