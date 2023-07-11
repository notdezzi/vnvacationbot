const {
  Client,
  ButtonInteraction,
  EmbedBuilder,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require("discord.js");

const verifySchema = require("../../schemas/verifySchema");

module.exports = {
  name: "interactionCreate",

  /**
   * @param {Client} client 
   * @param {ButtonInteraction} interaction 
   * @returns 
   */

  /**
   * ! Check the order of how you pass parameters in your event handler
   */
  async execute(interaction, client) {

      if (!interaction.isButton()) return;
      
      if (!interaction.guild || !interaction.channel || !interaction.user || interaction.user.bot) return;

      const { guild, member, customId } = interaction;

      if (customId === "verify-button") {
          const VoteCountedReply = "You have been verified.";
          const dataVerify = await verifySchema.findOne({ guildId: guild.id });
          member.roles.add(dataVerify.roleId);
          interaction.reply({content: VoteCountedReply, ephemeral: true});
      }
  }
}