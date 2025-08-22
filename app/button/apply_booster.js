const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    execute: async (interaction) => {
        try {
            // Create the modal
            const modal = new ModalBuilder()
                .setCustomId("apply_booster_modal")
                .setTitle("Booster Application");

            // Raider.IO URL input
            const raiderIOInput = new TextInputBuilder()
                .setCustomId("raiderio_url")
                .setLabel("Raider.IO URL")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("https://raider.io/characters/...")
                .setRequired(true);

            // Boost Type input
            const boostTypeInput = new TextInputBuilder()
                .setCustomId("boost_type")
                .setLabel("Boost Type")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("Mythic+, Raid, Level Boost etc...")
                .setRequired(true);

            // Action rows
            const row3 = new ActionRowBuilder().addComponents(raiderIOInput);
            const row4 = new ActionRowBuilder().addComponents(boostTypeInput);

            modal.addComponents(row3, row4);

            // Show modal
            await interaction.showModal(modal);

        } catch (err) {
            console.error("Error in apply_booster button:", err);
            if (!interaction.replied) {
                await interaction.reply({ content: "❌ Something went wrong.", ephemeral: true });
            }
        }
    }
};
