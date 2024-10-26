const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { token, roleId, ownerId } = require('./config.json');
const { token } = require('./config.json');
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

client.commands = new Collection();

// Carrega os comandos
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
const command = require(`./commands/${file}`);
client.commands.set(command.data.name, command);
}

// Carrega os eventos
const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
const event = require(`./events/${file}`);
if (event.once) {
client.once(event.name, (...args) => event.execute(...args));
} else {
client.on(event.name, (...args) => event.execute(...args));
}
}

client.once('ready', () => {
console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
if (!interaction.isCommand()) return;

const command = client.commands.get(interaction.commandName);

if (!command) return;

try {
await command.execute(interaction);
} catch (error) {
console.error(error);
await interaction.reply({ content: 'Houve um erro ao executar esse comando!', ephemeral: true });
}
});

client.login(token);