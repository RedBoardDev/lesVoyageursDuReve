import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from 'discord.js';
import { createEmbed, createEventEmbed } from '../utils/embed.js';
import { executeDBRequest, getEventType, getEvent, getEvents, getUser } from '../utils/api.js';
import { loadConfigJson } from '../utils/global.js';

const config = await loadConfigJson();

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

async function getEventsMessageArray(data) {
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
        const embed = await createEventEmbed(data[i]);

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
    let eventsArray = await getEvents();

    if (!eventsArray)
        return;
    eventsArray = eventsArray.filter(obj => new Date(obj.date_end) >= new Date()).sort((o1, o2) => {
        if (o1.date_end > o2.date_end) {
            return 1;
        }
        if (o1.date_end < o2.date_end) {
            return -1;
        }
        return 0;
    });
    const messageArray = await getEventsMessageArray(eventsArray);
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

async function deleteEvent(interaction) {
    const event = await getEvent(interaction.options.getInteger("id"));
    const discordUserId = interaction.user.id;
    const dbUserId = (await getUser(discordUserId))?.id;

    if (!event) {
        await interaction.reply({ content: "Cet évènement n'éxiste pas, veuillez rentrer un identifiant valide.", ephemeral: true });
        return;
    }
    if (!dbUserId) {
        await interaction.reply({ content: "Votre compte **Les voyageurs du rève** n'est pas lié à discord, veuillez taper `/login` puis vous connecter sur le lien qui vous est envoyé pour lier votre compte", ephemeral: true });
        return;
    }
    if (event.admin_user_id !== dbUserId) {
        await interaction.reply({ content: "Vous n'êtes pas l'organisateur de cet évènement, vous ne pouvez donc pas le supprimer.", ephemeral: true });
        return;
    }

    executeDBRequest('DELETE', `/event/${event.id}`, config.API_TOKEN).then(async (res) => {
        await interaction.reply({ content: `L'évènement n°${event.id} a été supprimé avec succès.`, ephemeral: true });
    }).catch(async (err) => {
        await interaction.reply({ content: `Une erreur s'est produite lors de la suppression de l'évènement n°${event.id}.`, ephemeral: true });
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
                await deleteEvent(interaction);
                break;
            default:
                break;
        }
	},
};
