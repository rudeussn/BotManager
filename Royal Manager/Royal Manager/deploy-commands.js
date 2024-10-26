const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
const command = require(`./commands/${file}`);
commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
try {
console.log('Iniciando a atualização dos comandos globais');

await rest.put(
Routes.applicationCommands(clientId),
{ body: commands },
);

console.log('Comandos globais atualizados com sucesso');
} catch (error) {
console.error(error);
}
})();
