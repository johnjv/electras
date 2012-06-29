var FloorAnimation = (function ($) {
	"use strict";

	var H_WIN = 1365.33,
		W_CANDY = 80,
		W_FINAL = 40,
		X_START = 2048,
		X_GLOVE = 1480 + 104,
		X_BOX = 1440,
		X_BELT0 = 521,
		X_CAN = 250,
		Y_GLOVE_REST = H_WIN - 688,
		Y_GLOVE_OUT = H_WIN - 640,
		Y_BELT = H_WIN - 640 - W_CANDY / 2,
		Y_BOX = H_WIN - 200,
		T_CANDY_GAP = 1500,
		T_GLOVE_DELAY = (X_START - X_GLOVE) * 2, // time for glove to reach candy
		T_GLOVE_OUT = (Y_GLOVE_OUT - Y_GLOVE_REST), // time for glove to punch outward
		T_GLOVE_IN = T_GLOVE_OUT * 2, // time for glove to retract
		T_TEST = (X_START - X_GLOVE) * 2 - T_GLOVE_OUT, // time before candy is tested
		X_TEST = X_START - T_TEST / 2,
		T_ACCEPT_BELT = T_GLOVE_OUT, // time before belt reaches accepted candy
		T_ACCEPT_FALL = (Y_BOX - Y_BELT), // time for accepted candy to fall into box
		T_REJECT_BELT = (X_TEST - X_BELT0) * 2, // time for rejected candy to reach end of belt
		T_REJECT_FALL = (X_BELT0 - X_CAN) * 2, // time for rejected candy to fall to can
		T_FADE = 500, // time for candy to fade away
		T_LIGHT = 50; // time for puncher's light to turn on

	function createCandy(index, type, tStart, layoutState, expected) {
		var trimType, color, shape, src, elt, elapsed;
		trimType = $.trim(type);
		color = 'CRGY'.indexOf(trimType[0]);
		shape = 'o|-'.indexOf(trimType[1]);
		src = imgpath.get('resource/floor/candy' + color + shape, ['svg', 'png']);
		elt = $('<img></img>')
			.attr('src', src)
			.css({left: X_START, top: Y_BELT, width: W_CANDY})
			.delay(tStart)
			.animate({left: '-=1'}, {duration: 1, queue: true, complete: function () {
					FloorTally.setCandy(index, src);
					FloorTally.setExpected(index, expected);
				}})
			.animate({left: '-=' + (X_START - X_TEST - 1)},
				{duration: T_TEST, easing: 'linear', queue: true,
					complete: function () {
						Circuit.setState(layoutState);
						FloorTally.setActual(index, layoutState.accept,
							layoutState.accept === expected);
						if (layoutState.accept) {
							$('#light1').fadeIn(T_LIGHT);
						} else {
							$('#light1').fadeOut(T_LIGHT);
						}
						if (layoutState.accept === expected) {
							Audio.play('correct_sound');
						} else {
							Audio.play('incorrect_sound');
						}
					}});
		elapsed = tStart + T_TEST;
		if (layoutState.accept) {
			elt.animate({left: '-=' + (X_TEST - X_GLOVE)},
					{duration: T_ACCEPT_BELT, easing: 'linear', queue: true})
				.animate({left: '-=' + (X_GLOVE - X_BOX),
					top: '+=' + (Y_BOX - Y_BELT), width: W_FINAL},
					{duration: T_ACCEPT_FALL, easing: 'linear', queue: true})
				.animate({opacity: 0},
					{duration: T_FADE, easing: 'linear', queue: true,
						complete: function () { elt.remove(); }});
			elapsed += T_ACCEPT_BELT + T_ACCEPT_FALL;
		} else {
			elt.animate({left: '-=' + (X_TEST - X_BELT0)},
					{duration: T_REJECT_BELT, easing: 'linear', queue: true,
						complete: function () {
							Audio.play('garbage_sound');
						}})
				.animate({left: '-=' + (X_BELT0 - X_CAN),
						top: '+=' + (W_CANDY - W_FINAL) / 2, width: W_FINAL},
					{duration: T_REJECT_FALL, easing: 'linear', queue: true})
				.animate({opacity: 0},
					{duration: T_FADE, easing: 'linear', queue: true,
						complete: function () { elt.remove(); }});
			elapsed += T_REJECT_BELT + T_REJECT_FALL;
		}
		return {elt: elt, elapse: elapsed};
	}

	function animateGlove(seq) {
		var seq, glove, lastGloveIn, i, t;
		glove = $('#punchglove');
		lastGloveIn = 0;
		for (i = 0; i < seq.length; i += 1) {
			if (seq[i].circuitSays.accept) {
				t = i * T_CANDY_GAP;
				glove.delay(t + T_GLOVE_DELAY - T_GLOVE_OUT - lastGloveIn)
					.animate({top: '+=' + (Y_GLOVE_OUT - Y_GLOVE_REST)},
						{duration: T_GLOVE_OUT, easing: 'linear', queue: true,
							complete: function () {
								Audio.play('punch_sound');
							}})
					.animate({top: '-=' + (Y_GLOVE_OUT - Y_GLOVE_REST)},
						{duration: T_GLOVE_IN, easing: 'linear', queue: true});
				lastGloveIn = t + T_GLOVE_DELAY + T_GLOVE_IN;
			}
		}
	}

	function my() {
		var candies, seq, i, result, t;

		candies = $('<div></div>').attr('id', 'candies');
		seq = computeSequence(LevelSelector.getCurrentLevel());

		this.seq = seq;
		this.candies = candies;

		FloorTally.showCleared();
		t = 0;
		for (i = 0; i < seq.length; i += 1) {
			result = createCandy(i, seq[i].type, i * T_CANDY_GAP,
				seq[i].circuitSays, seq[i].levelSays);
			candies.append(result.elt);
			t = Math.max(t, result.elapse);
		}
		animateGlove(seq);
		Audio.loop('belt_sound');
		setTimeout(function () {
			Audio.fadeOut('belt_sound', 100);
		}, t);
		$('#factory').append(candies);
	}

	my.prototype.remove = function () {
		this.candies.remove();
	};

	my.prototype.pause = function () {
	};

	return my;              
}(jQuery));
