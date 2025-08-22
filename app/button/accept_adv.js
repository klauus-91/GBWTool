const { ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { getApplication, removeApplication } = require("../db/memory");
const { addAdv } = require("../db/dbAdvertiser");

module.exports = {
    execute: async (interaction) => {
        try {
            // Only allow staff with ManageRoles
            if (!interaction.member.permissions.has("ManageRoles")) {
                return interaction.reply({ content: "❌ You don’t have permission to accept advertisers.", ephemeral: true });
            }

            // Extract applicant ID from button customId
            const [, applicantId] = interaction.customId.split(":");
            const guild = interaction.guild;

            // Fetch member
            const member = await guild.members.fetch(applicantId).catch(() => null);
            if (!member) {
                return interaction.reply({ content: "❌ Could not find the user in the server.", ephemeral: true });
            }

            // Get stored application data
            const data = getApplication(applicantId);
            if (!data) return interaction.reply({ content: "❌ Application data not found.", ephemeral: true });

            const { raiderIO, battleTag, boostType, vouch, accountNumber } = data;
            console.log(data)

            // Insert/update advertiser in DB
            await addAdv({
                userId: applicantId,
                raiderIo: data.raiderIO,
                battleTag: data.battleTag,
                vouch: data.vouch,
                accountNumber: parseInt(data.accounts, 10) || 1, // ensure it's a number
                boostType: data.boostType
            });

            // Remove application from memory
           removeApplication(applicantId);

            // Optional: assign advertiser role
            const ADVERTISER_ROLE_ID = "1393591283968245761"; // replace with your role ID
            const role = guild.roles.cache.get(ADVERTISER_ROLE_ID);
            if (role) await member.roles.add(role);

            // Send DM to applicant
            const dmImage = new AttachmentBuilder("assets/img/45456.png"); // same as modal confirmation
            const dmEmbed = new EmbedBuilder()
                .setTitle(`🎉 You’ve Successfully Claimed as an Advertiser!`)
                .setDescription(
                    "📌 Advertiser Rules – What You Are Allowed to Do\n\n" +
                    "🔹 Claim Boost Requests\n" +
                    "You can claim open boost tickets and take full responsibility for them.\n\n" +
                    "🔹 Talk to the Customer\n" +
                    "You’re allowed to message the customer to confirm details and organize the run.\n\n" +
                    "🔹 Invite Boosters\n" +
                    "You can choose and invite boosters for the run from the team or community.\n\n" +
                    "🔹 Handle Gold Payment\n" +
                    "You are responsible for making sure the gold is handed over to the right collector.\n\n" +
                    "🔹 Start and Manage the Boost\n" +
                    "You control the timing of the run and make sure everything runs smoothly.\n\n" +
                    "🔹 Use Approved Macros to Advertise\n\n" +
                    "🔹 Report Problems\n" +
                    "If there’s an issue (like no gold or a no-show), you can contact support or ping a manager."
                )
                .setColor(0x00FF00)
                .setImage("attachment://45456.png");

            try {
                await member.send({ embeds: [dmEmbed], files: [dmImage] });
            } catch (dmError) {
                console.warn(`Could not DM ${member.user.tag}:`, dmError.message);
            }

            // Delete the staff message after a short delay
            setTimeout(() => {
                try {
                    interaction.message.delete();
                } catch (err) {
                    console.error("Failed to delete staff message:", err);
                }
            }, 5000);

            // Optionally acknowledge interaction to prevent "This interaction failed"
            await interaction.deferUpdate();

        } catch (err) {
            console.error("Error in accept_adv.js:", err);
            if (!interaction.replied) {
                await interaction.reply({ content: "❌ Something went wrong.", ephemeral: true });
            }
        }
    }
};
