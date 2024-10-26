const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const config = require('../config.json'); // Certifique-se de que o caminho para o config.json está correto

module.exports = {
data: new SlashCommandBuilder()
.setName('afk')
.setDescription('Ativa o modo AFK com um motivo opcional')
.addStringOption(option =>
option.setName('reason')
.setDescription('O motivo pelo qual você está AFK')
.setRequired(false)),
async execute(interaction) {
const roleId = config.roleId; // Lê o roleId do config.json

if (!interaction.member.roles.cache.has(roleId)) {
return interaction.reply({ content: `🚫 Você não possui permissão para utilizar este comando.`, ephemeral: true });
}

const reason = interaction.options.getString('reason') || 'Não especificado';
const member = interaction.member;

// Salva o estado AFK do usuário
const afkList = JSON.parse(fs.readFileSync('afklist.json', 'utf8'));
afkList[member.id] = { reason, timestamp: Date.now() };
fs.writeFileSync('afklist.json', JSON.stringify(afkList, null, 2));

const embed = new EmbedBuilder()
.setColor('#FFA500')
.setTitle('Modo AFK Ativado')
.setDescription(`**Você está agora no modo AFK.** 
    **Motivo:** ${reason}`)
.setTimestamp();

interaction.reply({ embeds: [embed], ephemeral: true });
}
};