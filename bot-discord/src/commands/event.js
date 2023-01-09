import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } from 'discord.js';
import { createEmbed } from '../utils/embed.js';

async function sendInfos(interaction) {
    await interaction.reply({embeds: [createEmbed("Test", "test", "#5f85db", "")] });
}

async function createEventModal(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('event-create')
        .setTitle('Créer un évènement');

    const titleInput = new TextInputBuilder()
        .setCustomId('titleInput')
        .setLabel("Le titre de l'évènement")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const descriptionInput = new TextInputBuilder()
        .setCustomId('descriptionInput')
        .setLabel("La description de l'évènement")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

    const startDateInput = new TextInputBuilder()
        .setCustomId('startDateInput')
        .setLabel("La date de début de l'évènement")
        .setPlaceholder("Exemple: 01/01/2000")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    const startHourInput = new TextInputBuilder()
        .setCustomId('startHourInput')
        .setLabel("L'heure de début de l'évènement")
        .setPlaceholder("Exemple: 23:59")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)

    const durationInput = new TextInputBuilder()
        .setCustomId('durationInput')
        .setLabel("La date de fin de l'évènement")
        .setPlaceholder("Exemple: 1h | 45m")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)

    modal.addComponents(
        new ActionRowBuilder().addComponents(titleInput),
        new ActionRowBuilder().addComponents(descriptionInput),
        new ActionRowBuilder().addComponents(startDateInput),
        new ActionRowBuilder().addComponents(startHourInput),
        new ActionRowBuilder().addComponents(durationInput)
    );
    await interaction.showModal(modal);
}

export let command = {
	data: new SlashCommandBuilder()
		.setName("event")
		.setDescription("Quelques commandes pour gérer les events")

        .addSubcommand(subcommand => subcommand
            .setName("list")
            .setDescription("Liste tous les évènements à venir")
        )
        .addSubcommand(subcommand => subcommand
            .setName("delete")
            .setDescription("Supprime un évènement spécifique")
            .addIntegerOption(id => id
                .setName("id")
                .setDescription("L'id de l'évènement à supprimer")
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName("create")
            .setDescription("Crée un nouvel évènement")
        ),
	async execute(interaction) {
        switch (interaction.options.getSubcommand()) {
            case "list":
                await interaction.reply({ content: `Not implemented yet`, ephemeral: true });
                break;
            case "remove":
                const id = interaction.options.getInteger("id");
                await interaction.reply({ content: `Not implemented yet`, ephemeral: true });
                break;
            case "create":
                await createEventModal(interaction);
                break;
            default:
                break;
        }
	},
};
