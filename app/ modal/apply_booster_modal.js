const { EmbedBuilder } = require("discord.js");

module.exports = async (interaction) => {
    try {
        // Collect user input
        const raiderIO = interaction.fields.getTextInputValue("raiderio_url");
        const boostType = interaction.fields.getTextInputValue("boost_type");

        // Send the application to a staff/admin channel
        const STAFF_CHANNEL_ID = "1408372098560426055"; // replace with your channel ID
        const channel = await interaction.client.channels.fetch(STAFF_CHANNEL_ID);

        const embed = new EmbedBuilder()
            .setTitle(`New Booster Application: ${interaction.user.tag}`)
            .addFields(
                { name: "Boost Type", value: boostType, inline: true },
                { name: "Raider.IO", value: raiderIO }
            )
            .setColor(0x00ff00)
            .setTimestamp();

        await channel.send({ embeds: [embed] });

        // Reply to user
        await interaction.reply({ content: "✅ Your booster application has been submitted!", ephemeral: true });

    } catch (err) {
        console.error("Error handling apply_booster_modal submission:", err);
        if (!interaction.replied) {
            await interaction.reply({ content: "❌ Something went wrong.", ephemeral: true });
        }
    }
};
