module.exports = {
	scheduleDaily: (time, triggerThis) => {
		const split = time.split(':');
		const startTime = new Date(); startTime.setHours(Number(split[0]), Number(split[1]));
		const now = new Date();
		if (startTime.getTime() < now.getTime()) startTime.setHours(startTime.getHours() + 24);
		setTimeout(() => {
			triggerThis();
			setInterval(triggerThis, 24 * 60 * 60 * 1000);
		}, startTime.getTime() - now.getTime());
	},
	
	check_in_emoji: '🧑‍💻',
	
	days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
};
