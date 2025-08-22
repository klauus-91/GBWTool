const { ButtonStyle, ActionRowBuilder, ButtonBuilder, AttachmentBuilder, EmbedBuilder  } = require("discord.js");
const { getApplication, removeApplication } = require("../db/memory");
const {addBooster} = require("../db/dbBooster");
const {getBoosterRules} = require("../db/dbBoosterRules");

async function getRaiderIoProfile(region, realm, name) {
    const accessKey = 'RIOLs5L1Y9vrmA5qh9yUzg9Xb';
    const apiUrl = `https://raider.io/api/v1/characters/profile?access_key=${accessKey}&region=${region}&realm=${realm}&name=${name}&fields=mythic_plus_scores_by_season:current`;
    const response = await fetch(apiUrl, { headers: { 'accept': 'application/json' } });
    const data = await response.json();
    return data;
}
async function setRole(guild, userId, score) {
    const boosterRules = await getBoosterRules();

    let rule = boosterRules.find(r => score >= r.score_min && score <= r.score_max);

    if (!rule) {
        rule = boosterRules[0]

    }
    console.log(rule);

    try {
        const role = await guild.roles.fetch(rule.role);
        if (!role) {
            console.log(`Role ID ${rule.role} not found in guild`);
            return;
        }

        const member = await guild.members.fetch(userId);
        await member.roles.add(role);

        console.log(`Role ${role.name} assigned to ${member.user.tag}`);
    } catch (error) {
        console.error(`Error assigning role: ${error}`);
    }
}

function parseRaiderIoUrl(raiderIo) {
    // Remove query params
    const cleanUrl = raiderIo.split('?')[0];

    // Split into parts
    const parts = cleanUrl.split('/');

    // Find index of "characters"
    const charIndex = parts.indexOf("characters");
    if (charIndex === -1 || !parts[charIndex + 3]) {
        throw new Error("❌ Invalid Raider.IO URL format");
    }

    const region = parts[charIndex + 1]; // "eu"
    const realm = decodeURIComponent(parts[charIndex + 2]); // "archimonde"
    const characterName = decodeURIComponent(parts[charIndex + 3]); // "Gergruid"
    const cleanRaiderIO = decodeURIComponent(cleanUrl)

    return { region, realm, characterName, cleanRaiderIO };
}


module.exports = {
    execute: async (interaction) => {
        try {
            // Check if user clicking is staff
            if (!interaction.member.permissions.has("ManageRoles")) {
                return interaction.reply({ content: "❌ You don’t have permission to accept boosters.", ephemeral: true });
            }

            // Extract the applicant's user ID from the customId
            const [, applicantId] = interaction.customId.split(":");
            const guild = interaction.guild;

            // Fetch the member to assign role
            const member = await guild.members.fetch(applicantId).catch(() => null);
            if (!member) {
                return interaction.reply({ content: "❌ Could not find the user in the server.", ephemeral: true });
            }

            // Assign the Booster role (replace with your role ID)
            const BOOSTER_ROLE_ID = "1393589323676516384";
            const role = guild.roles.cache.get(BOOSTER_ROLE_ID);
            if (!role) {
                return interaction.reply({ content: "❌ Booster role not found.", ephemeral: true });
            }

            await member.roles.add(role);

            const data = getApplication(applicantId);
            if (!data) return interaction.reply({ content: "❌ Application data not found.", ephemeral: true });

            const raiderIo = data.raiderIO;
            const boostType = data.boostType;

            // After processing (optional)
            removeApplication(applicantId);

            const {region, realm, characterName, cleanRaiderIO} =  parseRaiderIoUrl(raiderIo)
            const profileData = await getRaiderIoProfile(region, realm, characterName);

            const score = profileData.mythic_plus_scores_by_season[0].scores.all;
            const faction = profileData.faction;
            let factionIcon = '';
            let factionRoleId = null;

            const ALLIANCE_ROLE_ID = '1404526654826483784'; // replace with your real role ID
            const HORDE_ROLE_ID = '1404525770734571601';    // replace with your real role ID

            if (faction === 'alliance') {
                factionIcon = 'A ';
                factionRoleId = ALLIANCE_ROLE_ID;
            } else if (faction === 'horde') {
                factionIcon = 'H ';
                factionRoleId = HORDE_ROLE_ID;
            } else {
                factionIcon = '';
            }

            await addBooster({userId: applicantId, userName: member.user.username, raiderIo: cleanRaiderIO, score})
            await setRole(guild, applicantId, score);
            try {
                await member.setNickname(characterName + '-' + realm + ' ' + factionIcon);
            } catch (e) {
                console.log(e)
            }




            // Add new faction role
            if (factionRoleId) {
                await member.roles.add(factionRoleId);
            }
            console.log('member renamed to ', characterName + '-' + realm);

            // Notify the applicant via DM
            try {
                await member.send(`✅ Congratulations! Your booster application has been **accepted** in GoBoostWoW. You now have the Booster role.`);
            } catch (dmError) {
                console.warn(`Could not DM ${member.user.tag}:`, dmError.message);
            }

            const boosterRulesImage = new AttachmentBuilder("assets/img/45456.png");

            // Create the DM embed
            const dmEmbed = new EmbedBuilder()
                .setTitle(`✅ Congratulations ${member.user.username}!`)
                .setDescription(
                    `Your booster application has been **approved** in GoBoostWoW!\n\n` +
                    `**Booster Rules – Please Read Carefully:**\n\n` +
                    `✅ Only you, the booster who claimed the boost, are allowed to complete it. No substitutions.\n` +
                    `✅ Follow all instructions given by the advertiser.\n` +
                    `✅ Complete the boost exactly as described in the request.\n` +
                    `✅ Always check your loot spec before starting the run.\n` +
                    `❌ Do not switch characters or change the group without manager approval.\n` +
                    `⏰ Be on time. Inform the customer or advertiser immediately if there's a delay.\n` +
                    `🧾 Keep proof of completion (screenshot or short video).\n` +
                    `🗨 Stay respectful and professional during the entire process.\n` +
                    `🚫 Misconduct, failure to deliver, or false claims may result in removal from the team.\n` +
                    `📎 Need help or something goes wrong? Contact a manager immediately.`
                )
                .setColor(0x00FF00) // green
                .setImage("attachment://45456.png");

// Send DM
            try {
                await member.send({ embeds: [dmEmbed], files: [boosterRulesImage] });
            } catch (dmError) {
                console.warn(`Could not DM ${member.user.tag}:`, dmError.message);
            }
            //await interaction.reply({ content: "✅ Booster accepted!", ephemeral: true });
            try {
                interaction.message.delete();
            } catch (err) {
                console.error("Failed to delete staff message:", err);
            }


        } catch (err) {
            console.error("Error in accept_booster.js:", err);
            if (!interaction.replied) {
                await interaction.reply({ content: "❌ Something went wrong.", ephemeral: true });
            }
        }
    }
};
