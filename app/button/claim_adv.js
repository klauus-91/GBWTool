const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField  } = require("discord.js");
const { setClaim, getClaim, removeClaim} = require("../db/memory");

module.exports = {
    execute: async (interaction) => {
        try {
            const [, customerId] = interaction.customId.split(":");
            const customer = await interaction.guild.members.fetch(customerId).catch(() => null);

           /* // check if already claimed
            if (getClaim(customerId)) {
                return interaction.reply({ content: "❌ This boost request has already been claimed.", ephemeral: true });
            }*/

            // store claim
            setClaim(customerId, interaction.user.id);

            // edit the original staff message
            const embed = EmbedBuilder.from(interaction.message.embeds[0])
                .setColor(0x00ff00)
                .addFields({ name: "📌 Claimed By", value: `${interaction.user}` });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("already_claimed")
                    .setLabel("✅ Claimed")
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true)
            );

            await interaction.update({ embeds: [embed], components: [row] });

            // ephemeral confirmation for advertiser
            await interaction.followUp({
                content: `✅ You have claimed this boost request for ${customer ? customer : "the customer"}.`,
                ephemeral: true
            });

            // DM customer
            if (customer) {
                try {
                    await customer.send(
                        `📌 Your boost request has been claimed by **${interaction.user.tag}**. A private channel has been created for you.`
                    );
                } catch (err) {
                    console.warn(`Could not DM customer ${customer.user.tag}: ${err.message}`);
                }
            }

            // ✅ Create private channel for advertiser & customer
            const uniqueId = Date.now(); // or crypto.randomUUID()
            const categoryId = "1393322374102782078";

            // Roles that should have access
            const managementRoles = [
                "1393308410434289664", // ManagementRole
                "1394357349539647488", // BotRole
                "1394749785830850630", // SuperVisor
                "1394317395597856878"  // Moderator
            ];

            const permissionOverwrites = [
                {
                    id: interaction.guild.roles.everyone.id,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: interaction.user.id, // advertiser
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
                },
                {
                    id: customerId, // customer
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory]
                },
                ...managementRoles.map(roleId => ({
                    id: roleId,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory]
                }))
            ];

            const channel = await interaction.guild.channels.create({
                name: `boost-request-${uniqueId}`,
                type: 0, // GUILD_TEXT
                parent: categoryId,
                permissionOverwrites
            });

            // welcome message in new channel
            await channel.send({
                content: `👋 Welcome ${customer}, ${interaction.user}!\nThis is your private boost request channel. Please use this space to finalize details.`
            });

        } catch (err) {
            console.error("Error in claim_adv.js:", err);
            if (!interaction.replied) {
                await interaction.reply({ content: "❌ Something went wrong while claiming.", ephemeral: true });
            }
        }
    }
};
