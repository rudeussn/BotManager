const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const fs = require('fs');
const config = require('../config.json'); // Certifique-se de que o caminho para o config.json está correto

module.exports = {
data: new SlashCommandBuilder()
.setName('ban')
.setDescription('Bane um usuário do servidor')
.addUserOption(option =>
option.setName('user')
.setDescription('O usuário a ser banido')
.setRequired(true))
.addStringOption(option =>
option.setName('reason')
.setDescription('O motivo do banimento')
.setRequired(true)),
async execute(interaction) {
const user = interaction.options.getUser('user');
const reason = interaction.options.getString('reason');
const roleId = config.roleId; // Lê o roleId do config.json

if (!interaction.member.roles.cache.has(roleId)) {
return interaction.reply({ content: `🚫 Você não possui permissão para utilizar este comando.`, ephemeral: true });
}

const member = interaction.guild.members.cache.get(user.id);
if (!member) {
return interaction.reply({ content: `❌ Usuário não encontrado no servidor.`, ephemeral: true });
}

try {
await member.ban({ reason });

// Adiciona o usuário à lista de banidos
const banList = JSON.parse(fs.readFileSync('banlist.json', 'utf8'));
banList.push({ id: user.id, tag: user.tag, reason, staffId: interaction.user.id });
fs.writeFileSync('banlist.json', JSON.stringify(banList, null, 2));

const channelEmbed = new Discord.EmbedBuilder()
.setTitle('Usuário banido')
.setDescription(`🔨 **${user.tag}** (ID: ${user.id}) Foi banido do servidor.

**Motivo:** ${reason}`)
.setColor('#FF0000') // Usando código hexadecimal para vermelho
.setTimestamp();

interaction.reply({ embeds: [channelEmbed] });
} catch (error) {
console.error('Erro ao tentar banir o usuário:', error);
interaction.reply({ content: `❌ o  Ocorreu um erro ao tentar banir o usuário: ${error.message}`, ephemeral: true });
}
}
};