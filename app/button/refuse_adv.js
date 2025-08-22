const { ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
const { getApplication, removeApplication } = require("../db/memory");

module.exports = {
    execute: async (interaction) => {
        try {
            // Permission check
            if (!interaction.member.permissions.has("ManageRoles")) {
                return interaction.reply({ content: "❌ You don’t have permission.", ephemeral: true });
            }

            const [, applicantId] = interaction.customId.split(":");
            const guild = interaction.guild;

            const member = await guild.members.fetch(applicantId).catch(() => null);

            const data = getApplication(applicantId);
            if (!data) return interaction.reply({ content: "❌ Application data not found.", ephemeral: true });

            removeApplication(applicantId);

            // DM the applicant
            if (member) {
                try {
                    const dmEmbed = new EmbedBuilder()
                        .setTitle("📌 Advertiser Application Status")
                        .setDescription(
                            "We appreciate your interest in joining GoBoostWoW.\n" +
                            "Unfortunately, your application has been **refused** at this time.\n\n" +
                            "This decision may be due to missing requirements, incomplete details, or not fully meeting our current standards.\n\n" +
                            "You are welcome to improve and reapply in the future.\nThank you for taking the time to apply!"
                        )
                        .setColor(0xff0000);

                    await member.send({ embeds: [dmEmbed] });
                } catch (err) {
                    console.warn(`Could not DM ${member.user.tag}:`, err.message);
                }
            }

            // Delete staff message
            setTimeout(() => {
                try { interaction.message.delete(); }
                catch (err) { console.error("Failed to delete staff message:", err); }
            }, 5000);

            await interaction.deferUpdate();

        } catch (err) {
            console.error("Error in refuse_adv.js:", err);
            if (!interaction.replied) {
                await interaction.reply({ content: "❌ Something went wrong.", ephemeral: true });
            }
        }
    }
};
