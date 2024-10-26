const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { ownerId } = require('../config.json');
const { reports } = require('./reports');

module.exports = {
data: new SlashCommandBuilder()
.setName('resetar-denuncias')
.setDescription('Reseta as denúncias de um staff')
.addUserOption(option =>
option.setName('usuario')
.setDescription('O usuário cujas denúncias serão resetadas')
.setRequired(true)),
async execute(interaction) {
if (interaction.user.id !== ownerId) {
return interaction.reply({ content: '🚫 Apenas o proprietário do bot pode usar este comando.', ephemeral: true });
}

const targetUser = interaction.options.getUser('usuario');
const userId = targetUser.id;

if (reports[userId]) {
delete reports[userId];

const embed = new EmbedBuilder()
.setTitle('🔄 Denúncias Resetadas')
.setColor('#00FF00')
.addFields(
{ name: '👤 Usuário', value: targetUser.username, inline: true },
{ name: '📋 Status', value: 'Denúncias resetadas com sucesso', inline: true }
)
.setTimestamp()
.setFooter({ text: 'Sistema de Denúncias', iconURL: 'https://example.com/icon.png' });

await interaction.reply({ embeds: [embed] });
} else {
await interaction.reply({ content: '🚫 Este usuário não possui denúncias registradas.', ephemeral: true });
}
},
};