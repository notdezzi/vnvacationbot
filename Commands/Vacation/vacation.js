const { EmbedBuilder, ChatInputCommandInteraction, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vacation")
    .setDescription("Create a Vacation request."),
  /**
   * @param {ChatInputCommandInteraction} interaction 
   */
  execute(interaction) {

    const createButton = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('vacation')
          .setLabel('Vacation')
          .setStyle(1)
          .setEmoji('🌴')
      );


    // interaction.reply({ content: "Pong!", ephemeral: true });
    const initEmbed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Vacation Service')
      .setDescription('Please read the Instructions: \n If you dont you dont get to go on vacation 👿')
      .setThumbnail('https://images.emojiterra.com/twitter/v14.0/512px/1f334.png')
      .addFields(
        { name: 'Period from', value: 'From when will you be abscent / on vacation' },
        { name: 'Period to', value: 'When will you be back' },
        { name: 'Reason', value: 'Why are you abscent' },
      )
      .setImage('https://media.discordapp.net/attachments/770742078309269544/857602260459585556/Rainbow_x3.gif')
      .setTimestamp()
      .setFooter({ text: 'Provided by VN Vacation Team', iconURL: 'https://images.emojiterra.com/twitter/v14.0/512px/1f334.png' });

    interaction.reply({ embeds: [initEmbed], components: [createButton] });

  }
}