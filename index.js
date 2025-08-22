const {
    Client,
    GatewayIntentBits,
    Partials,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder
} = require("discord.js");
const fs = require('fs');
const path = require("node:path");
require("dotenv").config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

// Channel where the embed should be posted
const APLLY_BOOST_CHANNEL_ID = "1408371800466788383";


client.once("ready", async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);

    // Fetch channel
    const channel = await client.channels.fetch(APLLY_BOOST_CHANNEL_ID);
    if (!channel) {
        console.error("❌ Could not find the channel.");
        return;
    }

    // Delete last 100 messages to prevent duplicates
    try {
        const messages = await channel.messages.fetch({ limit: 100 });
        if (messages.size > 0) {
            await channel.bulkDelete(messages, true);
            console.log(`🧹 Deleted ${messages.size} old messages.`);
        }
    } catch (err) {
        console.error("❌ Failed to delete messages:", err);
    }

    // Attach the local image
    const image = new AttachmentBuilder("assets/img/Gemini_Generated_Image_gkad4pgkad4pgkad.png");

    // Build the embed
    const embed = new EmbedBuilder()
        .setTitle("GoBoostWoW M+ Booster Application")
        .setDescription(
            "Click the **Apply** button and share your Raider.io link.\n" +
            "Make sure to use your own details, as the Raider.io character you link will also be your payment character.\n\n" +
            "📊 **RIO Score Requirements**\n" +
            "To ensure a better and more streamlined booster experience, the following RIO score requirements apply:\n\n" +
            "• **0–9 Keys**: Minimum **2700 RIO**\n" +
            "• **9–12 Keys**: Minimum **3000 RIO**\n\n" +
            "💰 **Boosters Dungeon Cut**\n" +
            "Mythic+: **60% of the total dungeon fee**"
        )
        .setColor(0x00ff00) // green
        .setImage("attachment://Gemini_Generated_Image_gkad4pgkad4pgkad.png");

    // Create the button
    const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("apply_booster")
            .setLabel("Apply Booster")
            .setStyle(ButtonStyle.Success) // Green
            .setEmoji("✅")
    );

    // Send embed with attached image and button
    await channel.send({ embeds: [embed], components: [button], files: [image] });
});

client.on('interactionCreate', async interaction => {
    try {
        // BUTTON
        if (interaction.isButton()) {
            const buttonBaseId = interaction.customId.split(':')[0];
            const buttonFile = path.join(__dirname, 'app', 'button', `${buttonBaseId}.js`);
            console.log("Button file:", buttonFile);
            const handler = require(buttonFile);
            await handler.execute(interaction);
        }

        // MODAL
        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'apply_booster_modal') {
                const aplly_booster = require('./app/ modal/apply_booster_modal');
                return aplly_booster(interaction);
            }
        }
    } catch (err) {
        console.error("Error in interactionCreate:", err);
        if (!interaction.replied) {
            await interaction.reply({ content: "❌ Something went wrong.", ephemeral: true });
        }
    }
});
client.login(process.env.TOKEN);
