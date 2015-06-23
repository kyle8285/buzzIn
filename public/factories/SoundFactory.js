app.factory('SoundFactory', function() {

	var themeSong = new Howl({
		urls: ['ThemeSong.mp3']
	});

	var buzzerSound = new Howl({
		urls: ['FamilyFeud-Ring.mp3']
	});

	return {
		buzzerSound: buzzerSound,
		themeSong: themeSong
	}
})