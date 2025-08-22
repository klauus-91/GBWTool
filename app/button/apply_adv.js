const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    execute: async (interaction) => {
        try {
            // Create the modal
            const modal = new ModalBuilder()
                .setCustomId("apply_advertiser_modal")
                .setTitle("Advertiser Application – GoBoostWoW");

            // Raider.IO input
            const raiderIOInput = new TextInputBuilder()
                .setCustomId("raiderIO")
                .setLabel("Raider.IO Profile Link")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("https://raider.io/characters/eu/archimonde/YourName")
                .setRequired(true);

            // BattleTag input
            const battleTagInput = new TextInputBuilder()
                .setCustomId("battleTag")
                .setLabel("BattleTag")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("YourName#1234")
                .setRequired(true);

            // Type of boost input
            const boostTypeInput = new TextInputBuilder()
                .setCustomId("boostType")
                .setLabel("Type of Boost")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("Mythic+, Raid, Leveling, etc.")
                .setRequired(true);

            // Number of accounts advertised
            const accountsInput = new TextInputBuilder()
                .setCustomId("accounts")
                .setLabel("Number of Accounts You Advertise With")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("e.g., 1, 2, 3")
                .setRequired(true);

            // Vouch input
            const vouchInput = new TextInputBuilder()
                .setCustomId("vouch")
                .setLabel("Vouch info (Discord + In-Game)")
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder("Yes: Discord#1234 / CharacterName or No")
                .setRequired(true);

            // Add all inputs to action rows
            const firstRow = new ActionRowBuilder().addComponents(raiderIOInput);
            const secondRow = new ActionRowBuilder().addComponents(battleTagInput);
            const thirdRow = new ActionRowBuilder().addComponents(boostTypeInput);
            const fourthRow = new ActionRowBuilder().addComponents(accountsInput);
            const fifthRow = new ActionRowBuilder().addComponents(vouchInput);

            modal.addComponents(firstRow, secondRow, thirdRow, fourthRow, fifthRow);

            // Show modal
            await interaction.showModal(modal);
        } catch (err) {
            console.error("Error showing advertiser modal:", err);
            if (!interaction.replied) {
                await interaction.reply({ content: "❌ Something went wrong.", ephemeral: true });
            }
        }
    }
};
