import dotenv from "dotenv";

import { Client, GatewayIntentBits, Message } from "discord.js";
import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import { addSpeechEvent, VoiceMessage } from "discord-speech-recognition";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
  ],
});
addSpeechEvent(client);

let textChannelId = "";
let voiceGuildId = "";

let prefix = "$";

client.on("messageCreate", (msg: Message) => {
  const message = msg.content.trim();
  if (!message.startsWith(prefix)) return;
  const command = message.substring(prefix.length);

  switch (command) {
    case "send": {
      textChannelId = msg.channelId;
      console.log(`Sending to ${textChannelId}`);
      break;
    }
    case "join": {
      let voiceChannel = msg.member?.voice.channel;
      if (voiceChannel) {
        console.log(`Joining ${voiceChannel?.id}`);
        voiceGuildId = voiceChannel.guildId;
        joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: voiceChannel.guild.id,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
          selfDeaf: false,
        });
      }
      break;
    }
    case "leave": {
      console.log(`Disconnecting from ${voiceGuildId}`);
      getVoiceConnection(voiceGuildId)?.disconnect();
    }
  }
});

client.on("speech", (msg: VoiceMessage) => {
  // If bot didn't recognize speech, content will be empty
  if (!msg.content) return;

  const channel = client.channels.cache.get(textChannelId);
  if (channel && channel.isTextBased()) {
    channel.send(`${msg.author.username}: ${msg.content}`);
  }
});

client.on("ready", () => {
  console.log("Ready!");
});

client.login(process.env.DISCORD_TOKEN);
