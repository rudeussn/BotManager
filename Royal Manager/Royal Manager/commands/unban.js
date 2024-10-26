const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const fs = require('fs');
const config = require('../config.json'); // Certifique-se de que o caminho para o config.json está correto

module.exports = {
data: new SlashCommandBuilder()
.setName('unban')
.setDescription('Desbane um usuário do servidor')
.addStringOption(option =>
option.setName('userid')
.setDescription('O ID do usuário a ser desbanido')
.setRequired(true)),
async execute(interaction) {
const userId = interaction.options.getString('userid');
const roleId = config.roleId; // Lê o roleId do config.json

if (!interaction.member.roles.cache.has(roleId)) {
return interaction.reply({ content: `🚫 Você não possui permissão para utilizar este comando`, ephemeral: true });
}

try {
const user = await interaction.guild.bans.fetch(userId).catch(() => null);
if (!user) {
return interaction.reply({ content: `❌ Usuário não encontrado na lista de banidos`, ephemeral: true });
}

await interaction.guild.bans.remove(userId);

// Remove o usuário da lista de banidos
let banList = JSON.parse(fs.readFileSync('banlist.json', 'utf8'));
banList = banList.filter(ban => ban.id !== userId);
fs.writeFileSync('banlist.json', JSON.stringify(banList, null, 2));

const channelEmbed = new Discord.EmbedBuilder()
.setTitle('usuário desbanido')
.setDescription(`🎉 **${user.user.tag}** (ID: ${user.user.id}) Foi desbanido do servidor`)
.setColor('#00FF00') // Usando código hexadecimal para verde
.setTimestamp();

interaction.reply({ embeds: [channelEmbed] });
} catch (error) {
console.error('Erro ao tentar desbanir o usuário:', error);
interaction.reply({ content: `❌ Ocorreu um erro ao tentar desbanir o usuário: ${error.message}`, ephemeral: true });
}
}
};