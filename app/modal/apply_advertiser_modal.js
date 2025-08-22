const {saveApplication} = require("../db/memory");
const { AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
module.exports = async function(interaction) {
    try {
        const raiderIO = interaction.fields.getTextInputValue("raiderIO");
        const battleTag = interaction.fields.getTextInputValue("battleTag");
        const boostType = interaction.fields.getTextInputValue("boostType");
        const accounts = interaction.fields.getTextInputValue("accounts");
        const vouch = interaction.fields.getTextInputValue("vouch");

        const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
        const image = new AttachmentBuilder("assets/img/54654.png");

        const embed = new EmbedBuilder()
            .setTitle("⏳ Application Received – Please Wait")
            .setDescription(
                "Thank you for applying to become an Advertiser in our GoBoostWow community!\n\n" +
                "📝 Your application has been received and is currently under review by the management team.\n\n" +
                "✅ We’ll contact you shortly if you're approved, or if we need any more information.\n\n" +
                "📌 Please do not claim any boost requests until your application is accepted."
            )
            .setColor(0x00ff00)
            .setImage("attachment://54654.png");

        await interaction.reply({ embeds: [embed], files: [image], ephemeral: true });

        // Send DM to the user
        try {
            await interaction.user.send({ embeds: [embed], files: [image] });
        } catch (dmError) {
            console.warn(`Could not DM ${interaction.user.tag}:`, dmError.message);
        }

        saveApplication(interaction.user.id, { raiderIO, battleTag, boostType, accounts, vouch });

        // Staff channel notification
        const staffChannel = await interaction.client.channels.fetch("1408372171700568085");
        if (!staffChannel) return console.error("❌ Staff channel not found.");

        const staffEmbed = new EmbedBuilder()
            .setTitle(`New Advertiser Application: ${interaction.user.tag}`)
            .addFields(
                { name: "Applicant", value: `<@${interaction.user.id}>`, inline: false },
                { name: "Raider.IO", value: raiderIO || "N/A", inline: false },
                { name: "BattleTag", value: battleTag || "N/A", inline: false },
                { name: "Boost Type", value: boostType || "N/A", inline: false },
                { name: "Accounts", value: accounts || "N/A", inline: false },
                { name: "Community Vouch", value: vouch || "N/A", inline: false }
            )
            .setColor(0x00ff00)
            .setTimestamp();
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`accept_adv:${interaction.user.id}`)
                .setLabel("Accept ✅")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`refuse_adv:${interaction.user.id}`)
                .setLabel("Refuse ❌")
                .setStyle(ButtonStyle.Danger)
        );

        await staffChannel.send({ embeds: [staffEmbed], components: [buttons] });

    } catch (err) {
        console.error("Error in apply_advertiser_modal:", err);
        if (!interaction.replied) {
            await interaction.reply({ content: "❌ Something went wrong.", ephemeral: true });
        }
    }
};
