// app/modal/boost_request_modal.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require("discord.js");

module.exports = async (interaction) => {
    try {
        const serviceType = interaction.fields.getTextInputValue("service_type");
        const image = new AttachmentBuilder("assets/img/45454.png"); // replace with your image
        // ✅ Reply to user
        const confirmEmbed = new EmbedBuilder()
            .setTitle("✅ Boost Request Submitted")
            .setDescription(
                `You’ve requested a **${serviceType}** service.\n\n` +
                "An advertiser will contact you shortly to confirm details."
            )
            .setColor(0x00ff00);

        await interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
        const roleId = '1393591283968245761';
        const content = `<@&${roleId}>`; // this triggers the notification
        // 📌 Build embed for staff channel
        const staffEmbed = new EmbedBuilder()
            .setTitle("🎟️ New Boost Request Received")
            .setDescription(
                `**Customer:** ${interaction.user}\n\n` +
                `**Description:** ${serviceType}\n\n` +
                "You’ve received a new customer ticket — please follow the steps below to handle it professionally and efficiently.\n\n" +
                "🟢 **Click the Claim button below to take this ticket.**\n\n" +
                "Once you click it:\n\n" +
                "✅ You become the assigned advertiser for this customer\n" +
                "✅ You are responsible for handling the order from start to finish\n" +
                "❌ Other advertisers will no longer be able to interact with this ticket"
            )
            .setColor(0x0099ff)
            .setImage("attachment://45454.png");

        const claimButton = new ButtonBuilder()
            .setCustomId(`claim_adv:${interaction.user.id}`)
            .setLabel("📩 Claim Ticket")
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(claimButton);

        // 📩 Send to staff channel
        const staffChannel = await interaction.client.channels.fetch("1408439947324555294");
        if (staffChannel) {
            await staffChannel.send({ embeds: [staffEmbed], components: [row], file: [image],  content,  });
        }
    } catch (err) {
        console.error("Error in boost_request_modal:", err);
        if (!interaction.replied) {
            await interaction.reply({ content: "❌ Could not process your request.", ephemeral: true });
        }
    }
};
