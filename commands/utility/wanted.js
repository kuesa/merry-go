const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const Jimp = require('jimp');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wanted')
        .setDescription('Generates a wanted poster for a user.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to generate a poster for')
                .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('bounty')
                .setDescription('The bounty to set for the user')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('Name to use instead of server nickname')),
    async execute(interaction) {
        const nameFont = await Jimp.loadFont('./commands/utility/tnr.fnt');
        const bountyFont = await Jimp.loadFont('./commands/utility/vertiky.fnt');
        let user = interaction.options.getUser('user');
        let member = interaction.options.getMember('user');
        let bounty = Math.abs(interaction.options.getInteger('bounty'));
        let nickname = interaction.options.getString('name');
        let name = (nickname ?? member.displayName).replace(/\s\[ch\. \d+\]/g, '');
        // use guild pfp first, then global pfp
        let pfp = await Jimp.read(member.avatarURL({ extension: 'png' }) ?? user.avatarURL({ extension: 'png' }));
        let poster = await Jimp.read('./commands/utility/wantedposter.png');
        let finalPoster = await new Jimp(751, 1063, '#000000ff');

        // resize pfp to fit inside poster window, then composite poster over the pfp
        //pfp.resize(730, 730); // composite is 19,89
        pfp.resize(565, 565); // composite 106, 189
        //pfp.resize(557, 425); // composite 105, 248
        finalPoster.composite(pfp, 105, 189, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacityDest: 1,
            opacitySource: 1
        });
        finalPoster.composite(poster, 0, 0, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacityDest: 1,
            opacitySource: 1
        });

        // add text for name and bounty
        let nameText = {
            text: name,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
        };

        let bountyText = {
            text: (bounty).toLocaleString(),
            alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
        };

        // print bounty
        finalPoster.print(
            bountyFont,
            165,
            873,
            bountyText,
            480,
            80
        );

        // print name
        finalPoster.print(
            nameFont,
            109,
            748,
            nameText,
            538,
            121
        );

        let attachment = new AttachmentBuilder(
            await finalPoster.getBufferAsync(Jimp.MIME_PNG),
            { name: 'poster.png' });
        await interaction.reply({ files: [attachment] });
    }
};
