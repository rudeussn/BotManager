const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const fs = require('fs');
const config = require('../config.json'); // Certifique-se de que o caminho para o config.json está correto

module.exports = {
data: new SlashCommandBuilder()
.setName('zstatus')
.setDescription('Status staff'),
async execute(interaction) {
const roleId = config.roleId; // Lê o roleId do config.json

if (!interaction.member.roles.cache.has(roleId)) {
return interaction.reply({ content: `🚫 Você não possui permissão para utilizar este comando.`, ephemeral: true });
}

await interaction.deferReply(); // Responde à interação imediatamente

try {
// Lê a lista de banimentos
const banList = JSON.parse(fs.readFileSync('banlist.json', 'utf8'));

// Conta os banimentos por staff
const banCount = {};
banList.forEach(ban => {
if (banCount[ban.staffId]) {
banCount[ban.staffId]++;
} else {
banCount[ban.staffId] = 1;
}
});

// Conta as mensagens enviadas pelo staff
const messageCount = {};
const channels = interaction.guild.channels.cache.filter(channel => channel.type === Discord.ChannelType.GuildText);

for (const channel of channels.values()) {
const messages = await channel.messages.fetch({ limit: 100 });
messages.forEach(message => {
if (message.member && message.member.roles.cache.has(roleId)) {
if (messageCount[message.author.id]) {
messageCount[message.author.id]++;
} else {
messageCount[message.author.id] = 1;
}
}
});
}

// Cria o embed com as informações
const embed = new Discord.EmbedBuilder()
.setTitle('📊 Status do Staff')
.setColor('#00FF00') // Usando código hexadecimal para verde
.setTimestamp()
.setDescription('Aqui está um resumo das atividades do staff no servidor');

Object.keys(banCount).forEach(staffId => {
const staffMember = interaction.guild.members.cache.get(staffId);
embed.addFields({ name: `👤 ${staffMember.user.tag}`, value: `🔨 Banimentos: ${banCount[staffId]}`, inline: true });
});

Object.keys(messageCount).forEach(staffId => {
const staffMember = interaction.guild.members.cache.get(staffId);
embed.addFields({ name: `👤 ${staffMember.user.tag}`, value: `💬 Mensagens: ${messageCount[staffId]}`, inline: true });
});

await interaction.editReply({ embeds: [embed] });
} catch (error) {
console.error('Erro ao tentar buscar o status do staff:', error);
await interaction.editReply({ content: `❌ Ocorreu um erro ao tentar buscar o status do staff: ${error.message}` });
}
}
};