var Audio = (function ($) {
	var my = {};

	var sounds = {};

	var soundEnabled = true;
	
	my.setEnabled = function (boolean_value) {
		soundEnabled = boolean_value;
	};
	
	my.isEnabled = function () {
		return soundEnabled;
	};

	my.play = function (id) {
		if (soundEnabled && sounds.hasOwnProperty(id)) {
			sounds[id].play();
		}
	};

	my.loop = function (id) {
		if (soundEnabled && sounds.hasOwnProperty(id)) {
			sounds[id].loop().play();
		}
	};

	my.fadeOut = function (id, duration) {
		var volume;
		if (sounds.hasOwnProperty(id)) {
			volume = sounds[id].getVolume();
			sounds[id].fadeOut(duration, function () {
				sounds[id].stop().setVolume(volume);
			});
		}
	};

	function loadAudio() {
		var audioData, body;

		audioData = {
			paper_sound: 'paper',
			paper_sound2: 'paper',
			belt_sound: 'belt3',
			punch_sound: 'punch',
			correct_sound: 'correct1',
			correct2_sound: 'correct2',
			incorrect_sound: 'incorrect',
			garbage_sound: 'garbage',
			click_sound: 'click',
			electric_sound: 'electric',
			eraser_sound: 'eraser'
		};


		body = $('body');
		$.each(audioData, function (key, name) {
			sounds[key] = new buzz.sound('../resource/audio/' + name,
				{formats: ['ogg', 'mp3']});
		});
	}

	$(document).ready(function () {
		var circuitSounds;

		// Wait a bit before loading audio since it's a lower priority
		setTimeout(loadAudio, 500);

		circuitSounds = {
			'wireStart': ['electric_sound'],
			'wireDone': ['electric_sound', 'correct2_sound'],
			'eraseWire': ['eraser_sound'],
			'eraseElement': ['eraser_sound'],
			'moveOut': ['garbage_sound'],
			'wireFailed': ['incorrect_sound'],
			'addDone': ['click_sound'],
			'moveDone': ['click_sound'],
		};

		Circuit.addChangeListener(function (e) {
			if (circuitSounds.hasOwnProperty(e.type)) {
				$.each(circuitSounds[e.type], function (i, name) {
					my.play(name);
				});
			}
		});
	});

	return my;
}(jQuery));
