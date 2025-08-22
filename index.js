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


async function applyBooster() {
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
}

async function applyAdv() {
    // Fetch channel for advertisers
    const ADV_CHANNEL_ID = "1408371877742641203"; // replace with your channel ID
    const channel = await client.channels.fetch(ADV_CHANNEL_ID);
    if (!channel) {
        console.error("❌ Could not find the advertiser channel.");
        return;
    }

    // Delete last 100 messages to prevent duplicates
    try {
        const messages = await channel.messages.fetch({ limit: 100 });
        if (messages.size > 0) {
            await channel.bulkDelete(messages, true);
            console.log(`🧹 Deleted ${messages.size} old advertiser messages.`);
        }
    } catch (err) {
        console.error("❌ Failed to delete messages:", err);
    }

    // Attach a local image (optional)
    const image = new AttachmentBuilder("assets/img/ss.JPG"); // replace with your image

    // Build the embed
    const embed = new EmbedBuilder()
        .setTitle("GoboostWOW Advertiser Application")
        .setDescription(
            "📢 Interested in Advertising & Making Gold with GoBoostWOW?\n" +
            "Do you have what it takes to manage bookings, organize teams, and help clients get their boosts done smoothly?\n\n" +
            "Whether you're experienced or looking to start, we’re looking for reliable Advertisers to join the GoBoostWOW team.\n\n" +
            "🎟️ Click the apply Button below to get the role + access to our advertiser tools.\n\n" +
            "💰 **Advertiser Cuts**\n" +
            "Mythic Plus: 35%\n" +
            "Raids: 25%\n" +
            "Leveling / Delves / Custom Orders: Varies (10–35%) based on content\n\n" +
            "📌 **What You’ll Do**\n" +
            "• Book customers for Mythic+, Raids, Leveling, and other services\n" +
            "• Assign available boosters and confirm schedules\n" +
            "• Ensure gold is collected and distributed fairly\n" +
            "• Follow all GoBoostWOW rules and maintain order logs"
        )
        .setColor(0xff9900) // orange for advertiser
        .setImage("attachment://ss.JPG");

    // Create the button
    const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("apply_adv")
            .setLabel("Apply Advertiser")
            .setStyle(ButtonStyle.Success) // Green
            .setEmoji("✅")

    );

    // Send embed with attached image and button
    await channel.send({ embeds: [embed], components: [button], files: [image] });
}

async function boostRequest() {
    try {
        const channel = await client.channels.fetch("1408439492058026054");
        const image = new AttachmentBuilder("assets/img/645465.png"); // replace with your image

        try {
            const messages = await channel.messages.fetch({ limit: 100 });
            if (messages.size > 0) {
                await channel.bulkDelete(messages, true);
                console.log(`🧹 Deleted ${messages.size} old boost requests.`);
            }
        } catch (err) {
            console.error("❌ Failed to delete messages:", err);
        }

        const embed = new EmbedBuilder()
            .setTitle("BOOST REQUEST")
            .setDescription(
                "🎟️ **Create a Boost Request**\n\n" +
                "Looking to book a Mythic+, Raid, Leveling, or Custom boost? You're in the right place! Our team will guide you through everything.\n\n" +
                "Click the 📩 **Create Boost Request** below to get started!\n\n" +
                "🔍 **What to Expect:**\n\n" +
                "• An Advertiser will claim your request shortly\n" +
                "• They’ll confirm details, boosters, and the gold price\n" +
                "• You’ll get clear instructions for payment\n" +
                "• Your run will be scheduled and completed quickly and professionally"
            )
            .setColor(0x00ff00)
            .setImage("attachment://645465.png");

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("boost_request")
                .setLabel("Boost Request")
                .setStyle(ButtonStyle.Success)
        );

        await channel.send({ embeds: [embed], components: [row], files: [image] });

        console.log("✅ Boost Request embed sent.");
    } catch (err) {
        console.error("Failed to send Boost Request embed:", err);
    }
}

client.once("ready", async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);

    //apply booster
    await applyBooster();

    // apply adv
    await applyAdv();

    //boost request
    await boostRequest();

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
                const aplly_booster = require('./app/modal/apply_booster_modal');
                return aplly_booster(interaction);
            }
            if (interaction.customId === 'apply_advertiser_modal') {
                const aplly_adv = require('./app/modal/apply_advertiser_modal');
                return aplly_adv(interaction);
            }
            if (interaction.customId === 'boost_request_modal') {
                const boost_request = require('./app/modal/boost_request_modal');
                return boost_request(interaction);
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
