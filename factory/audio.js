var Audio = (function ($) {
	var my = {};

	var soundEnabled = true;
	
	my.setEnabled = function (boolean_value) {
		soundEnabled = boolean_value;
	};
	
	my.isEnabled = function () {
		return soundEnabled;
	};

	my.play = function (sound_id) {
		if (soundEnabled) {
			$('#' + sound_id)[0].play();
		}
	}

	my.pause = function (sound_id) {
		if (soundEnabled) {
			$('#' + sound_id)[0].pause();
		}
	}

	function loadAudio() {
		var audioData, body;

		audioData = {
			correct_sound: 'correct1',
			belt_sound: 'belt3 loop',
			punch_sound: 'punch',
			paper_sound: 'paper',
			paper_sound2: 'paper',
			garbage_sound: 'garbage',
			incorrect_sound: 'incorrect',
			electric_sound: 'electric',
			eraser_sound: 'eraser',
			click_sound: 'click',
			correct2_sound: 'correct2'
		};

		body = $('body');
		$.each(audioData, function (key, name) {
			var parts, base, elt;
			parts = name.split();
			base = '../resource/audio/' + parts[0];
			elt = $('<audio></audio>').attr('id', key);
			elt.append($('<source></source>').attr('src', base + '.ogg')
				.attr('type', 'audio/ogg; codec=vorbis')
				.attr('preload', 'auto'));
			elt.append($('<source></source>').attr('src', base + '.mp3')
				.attr('type', 'audio/mp3').attr('preload', 'auto'));
			if (parts.length > 1 && parts[1] === 'loop') {
				elt.attr('loop', 'loop');
			}
			body.append(elt);
		});
	}

	$(document).ready(function () {
		var circuitSounds;

		loadAudio();

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
