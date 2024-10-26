const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { roleId } = require('../config.json');
const reports = require('./reports').reports;

module.exports = {
data: new SlashCommandBuilder()
.setName('denunciar')
.setDescription('Faz uma denúncia')
.addStringOption(option =>
option.setName('id')
.setDescription('ID do usuário a ser denunciado')
.setRequired(true))
.addStringOption(option =>
option.setName('motivo')
.setDescription('Motivo da denúncia')
.setRequired(true))
.addAttachmentOption(option => // Certifique-se de que esta linha está correta
option.setName('provas')
.setDescription('Provas da denúncia (pode incluir múltiplas prints)')
.setRequired(true)), // Deixe como true se o anexo for obrigatório
async execute(interaction) {
if (!interaction.member.roles.cache.has(roleId)) {
return interaction.reply({ content: 'Você não tem permissão para usar este comando.', ephemeral: true });
}

const userId = interaction.options.getString('id');
const reason = interaction.options.getString('motivo');
const proofs = interaction.options.getAttachment('provas'); // Certifique-se de que esta linha está correta

const embed = new EmbedBuilder()
.setTitle('🚨 Denúncia')
.setColor('#FF0000')
.addFields(
{ name: '👤 ID do Usuário', value: userId, inline: true },
{ name: '📋 Motivo', value: reason, inline: true }
)
.setTimestamp();

if (proofs) {
embed.setImage(proofs.url); // Adiciona a imagem de prova ao embed se disponível
}

// registra a denúncia
const user = interaction.user.id;
reports[user] = (reports[user] || 0) + 1;

await interaction.reply({ embeds: [embed] });
},
};