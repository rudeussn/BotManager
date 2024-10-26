const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const fs = require('fs');
const config = require('../config.json'); // Certifique-se de que o caminho para o config.json está correto

module.exports = {
data: new SlashCommandBuilder()
.setName('ban-list')
.setDescription('Mostra a lista de usuários banidos do servidor'),
async execute(interaction) {
const roleId = config.roleId; // Lê o roleId do config.json

if (!interaction.member.roles.cache.has(roleId)) {
return interaction.reply({ content: `🚫 Você não possui permissão para visualizar a lista de banidos`, ephemeral: true });
}

try {
const filePath = 'banlist.json';
let banList = [];

// Verifica se o arquivo existe
if (fs.existsSync(filePath)) {
const data = fs.readFileSync(filePath, 'utf8');
try {
banList = JSON.parse(data);
} catch (error) {
console.error('erro ao analisar o JSON:', error);
return interaction.reply({ content: '❌ Ocorreu um erro ao tentar analisar a lista de banidos', ephemeral: true });
}
}

// Verifica se banList é um array
if (!Array.isArray(banList)) {
banList = [];
}

// Verifica se a lista está vazia
if (banList.length === 0) {
return interaction.reply({ content: '✅ Não há usuários banidos neste servidor', ephemeral: true });
}

const embed = new Discord.EmbedBuilder()
.setTitle('📜 Lista de banidos')
.setColor('#FF0000') // Usando código hexadecimal para vermelho
.setTimestamp();

banList.forEach(ban => {
embed.addFields({ name: `${ban.tag} (ID: ${ban.id})`, value: `**Motivo:** ${ban.reason}`, inline: false });
});

interaction.reply({ embeds: [embed], ephemeral: true });
} catch (error) {
console.error('Erro ao tentar buscar a lista de banidos:', error);
interaction.reply({ content: `❌ Ocorreu um erro ao tentar buscar a lista de banidos: ${error.message}`, ephemeral: true });
}
}
};