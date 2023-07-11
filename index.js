const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
    Events,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require("discord.js");
const {
    Guilds,
    GuildMembers,
    GuildMessages
} = GatewayIntentBits;
const {
    User,
    Message,
    GuildMember,
    ThreadMember
} = Partials;

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages],
    partials: [User, Message, GuildMember, ThreadMember],
});

client.config = require("./config.json");
client.commands = new Collection();
client.subCommands = new Collection();
client.events = new Collection();
client.guildConfig = new Collection();

const thumbnail = 'https://images.emojiterra.com/twitter/v14.0/512px/1f334.png';
const footer = 'https://images.emojiterra.com/twitter/v14.0/512px/1f334.png';
const rainbow = 'https://media.discordapp.net/attachments/770742078309269544/857602260459585556/Rainbow_x3.gif';
const {
    loadEvents
} = require("./Handlers/eventHandler");
loadEvents(client);

const {
    loadConfig
} = require("./Functions/configLoader");
loadConfig(client);

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.customId == "vacation") {

        const vacmodal = new ModalBuilder()
            .setCustomId('vacmodal')
            .setTitle('Vacation Dates');

        const datefrom = new TextInputBuilder()
            .setCustomId('datefrom')
            .setLabel("From when will you be abscent / on vacation")
            .setStyle(TextInputStyle.Short)
            .setMinLength(8)
            .setMaxLength(10)
            .setPlaceholder('20.04.1337')
            .setRequired(true);

        const dateuntil = new TextInputBuilder()
            .setCustomId('dateuntil')
            .setLabel("When will you be back")
            .setStyle(TextInputStyle.Short)
            .setMinLength(8)
            .setMaxLength(10)
            .setPlaceholder('11.09.2001')
            .setRequired(true);

        const reason = new TextInputBuilder()
            .setCustomId('reason')
            .setLabel("Why are you abscent")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const firstActionRow = new ActionRowBuilder().addComponents(datefrom);
        const secondActionRow = new ActionRowBuilder().addComponents(dateuntil);
        const thirdActionRow = new ActionRowBuilder().addComponents(reason);

        vacmodal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

        await interaction.showModal(vacmodal);
    } else if (interaction.customId == "vacdecline") {
        //userid getter from embed er
        const vacdeclinemodal = new ModalBuilder()
            .setCustomId('vacdeclinemodal')
            .setTitle('Vacation Dates');
        const reason = new TextInputBuilder()
            .setCustomId('decreason')
            .setLabel("Why did you decline the Vacation")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        const reasonact = new ActionRowBuilder().addComponents(reason);
        vacdeclinemodal.addComponents(reasonact);

        await interaction.showModal(vacdeclinemodal);
    } else if (interaction.customId == "vacconfirm") {
        //userid getter from embed er
        const userid = interaction.message.embeds[0].fields[3].value.slice(2, -1)
        const datefrom = interaction.message.embeds[0].fields[0].value
        const dateuntil = interaction.message.embeds[0].fields[1].value
        console.log(userid)
        const vaccceptEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Vacation Accepted')
            .setDescription('Congrats! Your Vacation was accepted.')
            .setThumbnail(thumbnail)
            .setImage(rainbow)
            .addFields({
                name: 'Period from',
                value: datefrom
            }, {
                name: 'Period until',
                value: dateuntil
            })
            .setTimestamp()
            .setFooter({
                text: 'Provided by VN Vacation Team',
                iconURL: footer
            });
        const vaccceptEmbed2 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Vacation Angenommen')
            .setDescription(`Vacation for <@${userid}>`)
            .setThumbnail(thumbnail)
            .addFields({
                name: 'Period from',
                value: datefrom
            }, {
                name: 'Period until',
                value: dateuntil
            })
            .setImage(rainbow)
            .setTimestamp()
            .setFooter({
                text: 'Provided by VN Vacation Team',
                iconURL: footer
            });
            try{
                client.users.fetch(userid).then((user) => {
                    user.send({
                        embeds: [vaccceptEmbed]
                    });
                });
        }catch{
            const failembed = new EmbedBuilder().setTitle('Couldnt send DM to user');
            await interaction.reply({ embeds: [failembed], ephemeral: true });
        }
        await interaction.reply({
            embeds: [vaccceptEmbed2]
        });
        interaction.channel.messages.delete(interaction.message.id);
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === 'vacmodal') {
        const datefrom = interaction.fields.getTextInputValue('datefrom');
        const dateuntil = interaction.fields.getTextInputValue('dateuntil');
        const reason = interaction.fields.getTextInputValue('reason');
        const userid = interaction.user.id

        const confirm = new ButtonBuilder()
            .setCustomId('vacconfirm')
            .setLabel('Confirm Vacation')
            .setStyle(ButtonStyle.Success);

        const cancel = new ButtonBuilder()
            .setCustomId('vacdecline')
            .setLabel('Decline Vacation')
            .setStyle(ButtonStyle.Danger);
        const adminEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Vacation Request')
            .setDescription('Irgend so ein Faullenzer will wieder urlaub cheffe')
            .setThumbnail(thumbnail)
            .addFields({
                name: 'Period from',
                value: datefrom
            }, {
                name: 'Period until',
                value: dateuntil
            }, {
                name: 'Reason',
                value: reason
            }, {
                name: 'User',
                value: "<@" + userid + ">"
            }, )
            .setImage(rainbow)
            .setTimestamp()
            .setFooter({
                text: 'Provided by VN Vacation Team',
                iconURL: footer
            });

        const vacrow = new ActionRowBuilder()
            .addComponents(confirm, cancel);

        await client.channels.cache.get('Adminchannelid').send({
            embeds: [adminEmbed],
            components: [vacrow]
        });
        const successEmbed = new EmbedBuilder().setTitle('Successfully sent vacation request');
        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    } else if (interaction.customId == "vacdeclinemodal") {

        const userid = interaction.message.embeds[0].fields[3].value.slice(2, -1)
        const datefrom = interaction.message.embeds[0].fields[0].value
        const dateuntil = interaction.message.embeds[0].fields[1].value
        console.log(userid)
        const reason = interaction.fields.getTextInputValue('decreason');
        const vacdecEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Vacation Declined')
            .setDescription(`Vacation for <@${userid}> was declined by: <@${interaction.user.id}>`)
            .setThumbnail(thumbnail)
            .addFields({
                name: 'Reason',
                value: reason
            }, {
                name: 'Period from',
                value: datefrom
            }, {
                name: 'Period until',
                value: dateuntil
            })
            .setImage(rainbow)
            .setTimestamp()
            .setFooter({
                text: 'Provided by VN Vacation Team',
                iconURL: footer
            });
try{
        client.users.fetch(userid).then((user) => {
            user.send({
                embeds: [vacdecEmbed]
            });
        });
}catch{
    const failembed = new EmbedBuilder().setTitle('Couldnt send DM to user');
    await interaction.reply({ embeds: [failembed], ephemeral: true });
}
        await interaction.reply({
            embeds: [vacdecEmbed]
        });
        interaction.channel.messages.delete(interaction.message.id);
    }
});

client.login(client.config.token);