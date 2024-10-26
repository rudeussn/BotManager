const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
name: 'messageCreate',
async execute(message) {
if (message.author.bot) return;

// Lê a lista de usuários AFK
const afkList = JSON.parse(fs.readFileSync('afklist.json', 'utf8'));

// Verifica se algum usuário mencionado está AFK
message.mentions.users.forEach(user => {
if (afkList[user.id]) {
const reason = afkList[user.id].reason;
const embed = new EmbedBuilder()
.setColor('#FFA500')
.setTitle('🛌 Usuário AFK')
.setDescription(`${user.tag} **Está atualmente AFK.**
    **Motivo:** ${reason}`)
.setTimestamp();
message.channel.send({ embeds: [embed] });
}
});

// Remove o estado AFK se o usuário enviar uma mensagem
if (afkList[message.author.id]) {
const afkTime = Date.now() - afkList[message.author.id].timestamp;
const afkDuration = new Date(afkTime).toISOString().substr(11, 8); // Formata a duração em HH:MM:SS

// Remove o usuário da lista AFK
delete afkList[message.author.id];
fs.writeFileSync('afklist.json', JSON.stringify(afkList, null, 2));

const embed = new EmbedBuilder()
.setColor('#00FF00')
.setTitle('👋 Modo AFK Desativado')
.setDescription(`${message.author.tag} **Não está mais AFK.** 
    **Tempo AFK:** ${afkDuration}`)
.setTimestamp();

message.channel.send({ embeds: [embed] });
}
}
};