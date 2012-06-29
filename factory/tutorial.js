var Tutorial = (function ($, imgpath, Translator, LevelSelector, tutorial_scripts, Circuit) {
	"use strict";
	var ALL_EVENTS, highlightId;

	ALL_EVENTS = 'click mousedown mouseup mousemove touchstart touchmove touchend';

	highlightId = 0;

	function blink(elt, curId) {
		function blinker() {
			if (highlightId === curId) {
				elt.fadeOut(1000, function () {
					if(highlightId === curId){
						elt.fadeIn(1600);
					}
				});
			}
			setTimeout(blinker, 2600);
		}
		blinker();
	}

	function moveBubbleTo(x, y) {
		var bubble, body, x1, y1;
		bubble = $('#tutbubble');
		body = bubble.parent();
		x1 = Math.min(Math.max(0, x), body.width() - bubble.outerWidth());
		y1 = Math.min(Math.max(0, y), body.height() - bubble.outerHeight());
		bubble.css({left: x1, top: y1});
	}

	function MoveBubble(e) {
		var pos = $('#tutbubble').position();
		e.preventDefault();
		this.x0 = pos.left;
		this.y0 = pos.top;
		this.dragX = e.pageX;
		this.dragY = e.pageY;
	}

	MoveBubble.prototype.onDrag = function (e) {
		e.preventDefault();
		moveBubbleTo(this.x0 + (e.pageX - this.dragX),
			this.y0 + (e.pageY - this.dragY));
	};

	function moveBubbleHandler(e) {
		var b, offs, x, y;

		b = $('#tutbubble');
		if (b.size() > 0) {
			offs = b.offset();
			x = e.pageX - offs.left;
			y = e.pageY - offs.top;
			if (x >= 0 && y >= 0 && x < b.outerWidth() && y < b.outerHeight()) {
				return new MoveBubble(e);
			}
		}

		return null;
	}

	function transferEventUnder(e) {
		var elt, under;
		elt = $(e.target);
		elt.hide();
		under = document.elementFromPoint(e.pageX, e.pageY);
		elt.show();
		$(under).trigger(e);
	}

	var my = {};

	my.setHighlights = function (targets) {
		$('img.highlight').remove();
		highlightId += 1;
		$.each(targets, function (index, target) {
			var highlight, srcUrl;

			srcUrl = imgpath.get('resource/app/highlight', ['svg', 'png']);
			highlight = $('<img></img>')
				.addClass('highlight')
				.attr('src', srcUrl)
				.css({left: target.x, top: target.y,
					width: target.width, height: target.height})
				.on(ALL_EVENTS, transferEventUnder);
			$('#circuit').append(highlight);
		});
		blink($('img.highlight'), highlightId);
	};

	// set the current bubble (replacing the previous one if it exists)
	my.setBubble = function (target, levelId, textId) {
		var text, bubble, offs, x, y;

		text = Translator.getText('tutorial' + levelId, 'bubble' + textId);
		bubble = $('#tutbubble');
		if (bubble.length <= 0) {
			bubble = $('<div></div>').attr('id', 'tutbubble');
			$('#circuit_iface').append(bubble);
		}
		if (bubble.text() !== text) {
			bubble.hide();
			offs = $('#circuit').offset();
			x = offs.left + target.x + target.r;
			y = offs.top + target.y + target.r;
			if(x + bubble.width() > $('#circuit').width()){
				x = $('#circuit').width() - bubble.width();
			}
			if(y + bubble.height() > $('#circuit').height()){
				y = $('#circuit').height() - bubble.height();
			}
			bubble.text(text).css({left: x, top: y}).show();
		}
	};

	// remove the current bubble
	my.removeBubble = function () {
		$('#tutbubble').remove();
	};

	my.update = function (e) {
		var script = LevelSelector.getCurrentLevel().script;
		$('#tutbubble').hide();
		if (tutorial_scripts.hasOwnProperty(script)) {
			tutorial_scripts[script]();
		}
	};

	$(document).ready(function () {
		Circuit.addChangeListener(my.update);
		Circuit.addInterfaceHandler(moveBubbleHandler);
		Translator.addListener(my.update);
	});
}(jQuery, imgpath, Translator, LevelSelector, tutorial_scripts, Circuit));
