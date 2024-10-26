const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { roleId } = require('../config.json');

const reports = {};

module.exports = {
data: new SlashCommandBuilder()
.setName('reports')
.setDescription('Verifica quantas denúncias o usuário já fez')
.addUserOption(option =>
option.setName('usuario')
.setDescription('O usuário para verificar as denúncias')
.setRequired(false)), // Define como opcional
reports, // exporta o objeto reports
async execute(interaction) {
if (!interaction.member.roles.cache.has(roleId)) {
return interaction.reply({ content: '🚫 Você não tem permissão para usar este comando.', ephemeral: true });
}

const targetUser = interaction.options.getUser('usuario') || interaction.user;
const userId = targetUser.id;
const reportCount = reports[userId] || 0;

const embed = new EmbedBuilder()
.setTitle('📊 Relatório de Denúncias')
.setColor('#00FF00')
.addFields(
{ name: '👤 Usuário', value: `${targetUser.username}`, inline: true },
{ name: '📋 Denúncias Feitas', value: `${reportCount}`, inline: true }
)
.setTimestamp()
.setFooter({ text: 'Sistema de Denúncias', iconURL: 'https://example.com/icon.png' });

await interaction.reply({ embeds: [embed] });
}
};