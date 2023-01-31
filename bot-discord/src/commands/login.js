import { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';

// const config = await loadConfigJson();

export let command = {
	data: new SlashCommandBuilder()
		.setName("login")
		.setDescription("S'authentifier à son compte Les Voyageurs du Rêve"),
	async execute(interaction) {
        const row = new ActionRowBuilder()
        .addComponents(new ButtonBuilder()
            .setLabel(`S'authentifier`)
            .setStyle(ButtonStyle.Link)
            .setURL(`${process.env.API_URL}/login.html?discordId=${interaction.user.id}`),
        );
        await interaction.reply({ content: `Pour vous authentifier, veuillez cliquer sur le bouton suivant (vous devez déjà avoir un compte **Les voyageurs du rếve**)`, components: [row], ephemeral: true });
	},
};
