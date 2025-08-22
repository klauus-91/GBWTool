const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder  } = require("discord.js");
const { saveApplication } = require("../db/memory");

module.exports = async (interaction) => {
    try {
        // Collect user input
        const raiderIO = interaction.fields.getTextInputValue("raiderio_url");
        const boostType = interaction.fields.getTextInputValue("boost_type");

        saveApplication(interaction.user.id, { raiderIO, boostType });

        // Send the application to a staff/admin channel
        const STAFF_CHANNEL_ID = "1408372098560426055"; // replace with your channel ID
        const channel = await interaction.client.channels.fetch(STAFF_CHANNEL_ID);
        // 1️⃣ Reply to user with "Application Received" embed
        const image = new AttachmentBuilder("assets/img/64645.png"); // put your image in assets/img

        const embed = new EmbedBuilder()
            .setTitle("⏳ Application Received – Please Wait")
            .setDescription(
                "Thank you for applying to become a **Booster** in our GoBoostWow community!\n\n" +
                "📝 Your application has been received and is currently under review by the management team.\n\n" +
                "✅ We’ll contact you shortly if you're approved, or if we need any more information.\n\n" +
                "📌 Please do not join or accept any boosts until your application has been accepted and your role has been assigned."
            )
            .setColor(0x00ff00)
            .setImage("attachment://application_received.png") // match the filename in AttachmentBuilder
            .setTimestamp();

        await interaction.reply({ embeds: [embed], files: [image], ephemeral: true });

        try {
            await interaction.user.send({ embeds: [embed], files: [image] });
        } catch (dmError) {
            console.warn(`Could not send DM to ${interaction.user.tag}:`, dmError.message);
            // optionally notify user in ephemeral reply that DM failed
        }

        const staffEmbed = new EmbedBuilder()
            .setTitle(`New Booster Application`)
            .addFields(
                { name: "Applicant", value: `<@${interaction.user.id}>`, inline: false },
                { name: "Boost Type", value: boostType, inline: false },
                { name: "Raider.IO", value: raiderIO, inline: false }
            )
            .setColor(0x00ff00)
            .setTimestamp();

        // Create buttons
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`accept_booster:${interaction.user.id}`)
                .setLabel("Accept ✅")
                .setStyle(ButtonStyle.Success), // Green
            new ButtonBuilder()
                .setCustomId(`refuse_booster:${interaction.user.id}`)
                .setLabel("Refuse ❌")
                .setStyle(ButtonStyle.Danger) // Red
        );

        await channel.send({ embeds: [staffEmbed], components: [buttons] });


    } catch (err) {
        console.error("Error handling apply_booster_modal submission:", err);
        if (!interaction.replied) {
            await interaction.reply({ content: "❌ Something went wrong.", ephemeral: true });
        }
    }
};
