const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ch')
        .setDescription('Sets your current chapter.')
        .addIntegerOption(option =>
            option
                .setName('chapter')
                .setDescription('The chapter you are on')
                .setRequired(true)),
    async execute(interaction) {
        let currentNick = interaction.member.displayName;
        let badRegex = /\s\[ch\. \d+\]/g;
        let chapter = interaction.options.getInteger('chapter');
        let newNick;
        
        //check bounds
        if (!(-1 < chapter < 2000)) {
            await interaction.reply({ content: `Aye Matey! Enter chapters between 0 and 2000!`, ephemeral: true });

        } else {
            currentNick = currentNick.replace(badRegex, '');
            newNick = `${currentNick} [ch. ${chapter}]`;
            await interaction.member.setNickname(newNick);
            await interaction.reply({ content: `Set you to Chapter ${chapter}!`, ephemeral: true });
        }

        
    }
};