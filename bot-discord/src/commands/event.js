import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from 'discord.js';
import { createEmbed } from '../utils/embed.js';

async function sendInfos(interaction) {
    await interaction.reply({embeds: [createEmbed("Test", "test", "#5f85db", "")] });
}

async function createEvent(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('event-create')
        .setTitle('Créer un évènement');

    const titleInput = new TextInputBuilder()
        .setCustomId('titleInput')
        .setLabel("Titre")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const descriptionInput = new TextInputBuilder()
        .setCustomId('descriptionInput')
        .setLabel("Description")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

    const startDateInput = new TextInputBuilder()
        .setCustomId('startDateInput')
        .setLabel("Date / heure de début")
        .setPlaceholder("Exemple: 01/01/2000 23:59")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)

    const durationInput = new TextInputBuilder()
        .setCustomId('durationInput')
        .setLabel("Durée")
        .setPlaceholder("Exemple: 1h | 45m")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)

    modal.addComponents(
        new ActionRowBuilder().addComponents(titleInput),
        new ActionRowBuilder().addComponents(descriptionInput),
        new ActionRowBuilder().addComponents(startDateInput),
        new ActionRowBuilder().addComponents(durationInput)
    );
    await interaction.showModal(modal);
}

function getEventsMessageArray(data) {
    let messageArray = [];
    const prevButton = new ButtonBuilder()
        .setCustomId(`event-list-prev`)
        .setLabel(`⬅️`)
        .setStyle(ButtonStyle.Primary);
    const nextButton = new ButtonBuilder()
        .setCustomId(`event-list-next`)
        .setLabel(`➡️`)
        .setStyle(ButtonStyle.Primary);

    for (let i = 0; i < data.length; ++i) {
        const embed = createEmbed(data[i].title, data[i].description, '#000000', '');
        embed.addFields(
            { name: 'Créé par', value: data[i].createdBy, inline: true },
            { name: 'Date', value: data[i].date, inline: true },
            { name: 'Durée', value: data[i].duration, inline: true },
            { name: 'ID', value: data[i].id.toString(), inline: true }
        );

        let row;
        if (i === 0)
            row = new ActionRowBuilder().addComponents(nextButton);
        else if (i === data.length - 1)
            row = new ActionRowBuilder().addComponents(prevButton);
        else
            row = new ActionRowBuilder().addComponents(prevButton, nextButton);
        messageArray.push({ content: `Evènements à venir : (${i + 1}/${data.length})`, embeds: [embed], components: [row], ephemeral: true });
    }
    return messageArray;
}

async function listEvents(interaction) {
    let currentMessageIndex = 0;
    const messageArray = getEventsMessageArray([
        {title: "T1", createdBy: "Moi", date: "11/01/2023", duration: "1h", id: 1},
        {title: "T2", createdBy: "Moi", date: "12/01/2023", duration: "1h30", id: 2},
        {title: "T3", createdBy: "Moi", date: "13/01/2023", duration: "2h", id: 3},
        {title: "T4", createdBy: "Moi", date: "14/01/2023", duration: "2h30", id: 4},
        {title: "T5", createdBy: "Moi", date: "15/01/2023", duration: "3h", id: 5}     //TODO changer ça par les vraies infos venant de l'api
    ]);
    const sent = await interaction.reply(messageArray[currentMessageIndex]);

    const filter = (i) => {return (i.customId === 'event-list-prev' || i.customId === 'event-list-next') && i.user.id === interaction.user.id};
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 });

    collector.on('collect', async (i) => {
        if (i.customId === 'event-list-prev') {
            currentMessageIndex -= 1;
            await i.update(messageArray[currentMessageIndex]);
        }
        if (i.customId === 'event-list-next') {
            currentMessageIndex += 1;
            await i.update(messageArray[currentMessageIndex]);
        }
    });

    collector.on('end', async (collected) => {
        await sent.interaction.editReply({ components: [] });
    });
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
            case "create":
                await createEvent(interaction);
                break;
            case "list":
                await listEvents(interaction);
                break;
            case "delete":
                const id = interaction.options.getInteger("id");
                await interaction.reply({ content: `L'évènement n°${id} a été supprimé avec succès.`, ephemeral: true });
                break;
            default:
                break;
        }
	},
};
