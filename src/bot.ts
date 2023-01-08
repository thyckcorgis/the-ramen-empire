import dotenv from "dotenv";

import { Client, GatewayIntentBits, Message } from "discord.js";
import { joinVoiceChannel } from "@discordjs/voice";
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

let channelId = "";

let prefix = "$";

client.on("messageCreate", (msg: Message) => {
  const message = msg.content.trim();
  if (!message.startsWith(prefix)) return;
  const command = message.substring(prefix.length);

  switch (command) {
    case "send": {
      channelId = msg.channelId;
      console.log(`Sending to ${channelId}`);
      break;
    }
    case "join": {
      const voiceChannel = msg.member?.voice.channel;
      console.log(`Joining ${voiceChannel}`);
      if (voiceChannel) {
        joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: voiceChannel.guild.id,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
          selfDeaf: false,
        });
      }
    }
  }
});

client.on("speech", (msg: VoiceMessage) => {
  // If bot didn't recognize speech, content will be empty
  if (!msg.content) return;

  const channel = client.channels.cache.get(channelId);
  if (channel && channel.isTextBased()) {
    channel.send(`${msg.author.username}: ${msg.content}`);
  }
});

client.on("ready", () => {
  console.log("Ready!");
});

client.login(process.env.DISCORD_TOKEN);
