const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { roleId } = require('../config.json');

module.exports = {
data: new SlashCommandBuilder()
.setName('provas')
.setDescription('Adiciona provas de uma denúncia')
.addStringOption(option =>
option.setName('id')
.setDescription('ID do usuário que foi denunciado')
.setRequired(true))
.addAttachmentOption(option =>
option.setName('prova')
.setDescription('Prova da denúncia (imagem obrigatória)')
.setRequired(true))
.addStringOption(option =>
option.setName('motivo')
.setDescription('Motivo da punição')
.setRequired(true))
.addStringOption(option =>
option.setName('punição')
.setDescription('Tipo de punição aplicada')
.setRequired(true)),
async execute(interaction) {
if (!interaction.member.roles.cache.has(roleId)) {
return interaction.reply({ content: '🚫 Você não tem permissão para usar este comando.', ephemeral: true });
}

const userId = interaction.options.getString('id');
const proof = interaction.options.getAttachment('prova');
const reason = interaction.options.getString('motivo');
const punishment = interaction.options.getString('punição');

const embed = new EmbedBuilder()
.setTitle('📁 Provas de Denúncia')
.setColor('#FF0000')
.addFields(
{ name: '👤 ID do Usuário/Nick', value: userId, inline: true },
{ name: '📋 Motivo', value: reason, inline: true },
{ name: '🖼️ Mídia', value: `[Clique aqui para ver a prova](${proof.url})`, inline: true },
{ name: '⚖️ Punição', value: punishment, inline: true }
)
.setTimestamp()
.setFooter({ text: 'Sistema de Denúncias', iconURL: 'https://example.com/icon.png' });

await interaction.reply({ embeds: [embed] });
},
};