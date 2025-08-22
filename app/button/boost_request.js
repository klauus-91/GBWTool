// interactions/buttons/boost_request.js
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    id: "boost_request", // must match the customId from your button
    execute: async (interaction) => {
        try {
            const modal = new ModalBuilder()
                .setCustomId("boost_request_modal")
                .setTitle("Create Boost Request");

            const serviceType = new TextInputBuilder()
                .setCustomId("service_type")
                .setLabel("Type of Service")
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("Mythic+, Raid, Level boost, etc...")
                .setRequired(true);

            const row = new ActionRowBuilder().addComponents(serviceType);
            modal.addComponents(row);

            await interaction.showModal(modal);
        } catch (err) {
            console.error("Error in boost_request button:", err);
            if (!interaction.replied) {
                await interaction.reply({ content: "❌ Something went wrong.", ephemeral: true });
            }
        }
    },
};
