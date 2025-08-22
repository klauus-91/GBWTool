const { ButtonStyle } = require("discord.js");
const { getApplication, removeApplication } = require("../db/memory");

module.exports = {
    execute: async (interaction) => {
        try {
            // Check if user clicking is staff
            if (!interaction.member.permissions.has("ManageRoles")) {
                return interaction.reply({ content: "❌ You don’t have permission to refuse boosters.", ephemeral: true });
            }

            // Extract the applicant's user ID from the customId
            const [, applicantId] = interaction.customId.split(":");
            const guild = interaction.guild;

            // Fetch the member
            const member = await guild.members.fetch(applicantId).catch(() => null);
            if (!member) {
                return interaction.reply({ content: "❌ Could not find the user in the server.", ephemeral: true });
            }

            // Get stored application data
            const data = getApplication(applicantId);
            if (!data) return interaction.reply({ content: "❌ Application data not found.", ephemeral: true });

            // After processing, remove from memory
            removeApplication(applicantId);

            // Send DM to applicant
            try {
                await member.send(
                    `📌 **Booster Application Status**\n\n` +
                    `We appreciate your interest in joining GoBoostWoW.\n` +
                    `Unfortunately, your application has been **refused** at this time.\n\n` +
                    `This decision may be due to missing requirements, incomplete details, or not fully meeting our current standards.\n\n` +
                    `You are welcome to improve and reapply in the future.\n` +
                    `Thank you for taking the time to apply!`
                );
            } catch (dmError) {
                console.warn(`Could not DM ${member.user.tag}:`, dmError.message);
            }

            // Delete the staff message
            setTimeout(() => {
                try {
                    interaction.message.delete();
                } catch (err) {
                    console.error("Failed to delete staff message:", err);
                }
            }, 500);

            // Acknowledge the interaction to prevent "interaction failed"
            await interaction.deferUpdate();

        } catch (err) {
            console.error("Error in refuse_booster.js:", err);
            if (!interaction.replied) {
                await interaction.reply({ content: "❌ Something went wrong.", ephemeral: true });
            }
        }
    }
};
