const Discord = require('discord.js');
const { token } = require('./config.json');
const { scheduleDaily, check_in_emoji, days } = require('./utils.js');

const client = new Discord.Client({ intents: 
	Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS |
	Discord.Intents.FLAGS.GUILD_MEMBERS
});

client.once("ready", async function() {
    const server = await client.guilds.fetch('988513060316643388'); // KLING Office
    const check_in_channel = await server.channels.fetch('989394366839803924'); // #check-in
	const attendance_channel = await server.channels.fetch('992460779368489030'); // #absentees

    scheduleDaily('00:00', async function() { // at 12:00 am
        const check_in_msg = await check_in_channel.send("@everyone check in by reacting below:");
        check_in_msg.react(check_in_emoji);

		const members = (await server.members.fetch()).filter(member => !member.user.bot);

        const presentees = (await (await check_in_msg.awaitReactions({
            filter: (reaction, user) => reaction.emoji.name == check_in_emoji && !user.bot,
            time: (23*60*60 + 59*60 + 59) * 1000 // 23 hours, 59 minutes, and 59 seconds
        })).first().users.fetch()).mapValues(user => members.get(user.id));
		presentees.delete(client.user.id);

		const absentees = members.difference(presentees);

		const today = new Date();
        let attendance_msg = `__**${days[today.getDay()]} ${today.getDate()}/${today.getMonth()}/${today.getFullYear()}**__\n\n**Present (${presentees.size}):**\n`;
		presentees.each(presentee => attendance_msg += presentee.displayName + '\n');
		attendance_msg += `\n**Absent (${absentees.size}):**\n`;
        absentees.each(absentee => attendance_msg += absentee.displayName + '\n');

        attendance_channel.send(attendance_msg);
        check_in_msg.delete();
    });
});

client.login(token);
