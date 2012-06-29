var Clipboard = (function ($, Translator, all_levels, LevelSelector, Audio) {
	"use strict";

	var LEVEL1_PAGE = 3;
	var CREDITS_PAGE = 23;
	
	var clipboardVisible = true;
	var curIndex = 0;

	function checkComplete() {
		var level = LevelSelector.getCurrentLevel();
		var page = curIndex;
		if (level && level.complete) {
			$('#row' + level.levelid).children('.checkmark').html('<img id = "check" src = "../levels/images/checkmark.png">');
			$('#page' + page).children('.complete').show();
		}
	}

	function transitionCut(src, dst) {
		dst.show();
		if (src) {
			src.hide();
		}
	}

	function transitionNext(src, dst) {
		dst.removeAttr('style');
		src.css('z-index', 2);
		dst.css('z-index', 1);
		dst.show();
		src.stop().animate({
			top: '-=' + Math.floor(dst.height() / 2),
			transform: 'scale(1, 0.01)'
		}, 500, function () {
			src.hide();
			src.css('z-index', 0);
		});
	}

	function transitionPrev(src, dst) {
		var d;
		dst.removeAttr('style');
		d = Math.floor(dst.height() / 2);
		dst.css({ zIndex: 2, transform: 'scale(1, 0.01)', top: '-=' + d });
		src.css('z-index', 1);
		dst.show();
		dst.stop().animate({ top: '+=' + d, transform: 'scale(1)' },
			500, function () {
				src.hide();
			});
	}


	function goToPage(pageIndex) {
		var oldIndex, oldPage, newPage;
		checkComplete();
		if (pageIndex >= 0 && pageIndex < CREDITS_PAGE) {
			oldIndex = curIndex;
			curIndex = pageIndex;
			oldPage = $('#page' + oldIndex);
			newPage = $('#page' + pageIndex);

			Audio.play('paper_sound');
			if (pageIndex > oldIndex) {
				transitionNext(oldPage, newPage);
				$('#prev').fadeTo('slow', '1');
			} else {
				transitionPrev(oldPage, newPage);
				$('#next').fadeTo('slow', '1');
			}
			if (pageIndex < 3) {
				$('#circuit').hide();
				$('#factory').hide();
				clipboardButtons.hint.setEnabled(false);
				clipboardButtons.level.setEnabled(false);
				LevelSelector.setLevel(null);
			} else {
				$('#circuit').show();
				$('#factory').show();
				clipboardButtons.hint.setEnabled(true);
				clipboardButtons.level.setEnabled(true);
				LevelSelector.setLevel(all_levels[pageIndex - 3]);
			}
			$('.hintText').hide();
		} else if (pageIndex === CREDITS_PAGE) {
			oldIndex = curIndex;
			curIndex = pageIndex;
			oldPage = $('#page' + oldIndex);

			LevelSelector.setLevel(null);
			Credit.slideDesc();
			transitionNext(oldPage, $('#page23'));
			clipboardButtons.hint.setEnabled(false);
			clipboardButtons.level.setEnabled(true);
			$('#circuit').hide();
			$('#factory').hide();
		} else {
			return; // page invalid, so no effect
		}
		clipboardButtons.prev.setEnabled(pageIndex > 0);
		clipboardButtons.next.setEnabled(pageIndex < CREDITS_PAGE);
	}

	function goPrev() {
		if (curIndex > 0) {
			goToPage(curIndex - 1);
		}
	}

	function goNext() {
		if (curIndex < CREDITS_PAGE) {
			goToPage(curIndex + 1);
		}
	}

	function goLevels() {
		var lev = LevelSelector.getCurrentLevel();
		goToPage(1 + Math.floor(lev / 10));
	}

	function goInfo() {
		goToPage(CREDITS_PAGE);
	}

	function showHint() {
		if (curIndex >= 3) {
			$('.hintText').show();
		}
	}

	function alterLang() {
		Translator.changeLanguage(Translator.getCurrentLanguage());
		//can only go from English to Korean, but cannot go back to English
	}

	function toggleAudio() {
		if (Audio.isEnabled()){
			sound.attr('src', '../levels/images/soundoff.png');
			Audio.setEnabled(false);
		} else {
			sound.attr('src', '../levels/images/soundon.png');
			Audio.setEnabled(true);
		}
	}

	function Button(onClick, x, y, w, h) {
		this.onClick = onClick;
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.fadeElt = null;
	}

	Button.prototype.setEnabled = function (value) {
		var elt;
		if (value) {
			elt = this.fadeElt;
			if (elt !== null) {
				this.fadeElt = null;
				elt.remove();
			}
		} else {
			// TODO
		}
	};

	var clipboardButtons = {
		prev:  new Button(goPrev,       628, 1185, 132, 132),
		level: new Button(goLevels,     848, 1185, 132, 132),
		hint:  new Button(showHint,    1068, 1185, 132, 132),
		next:  new Button(goNext,      1288, 1185, 132, 132),
		info:  new Button(goInfo,       770,  203, 100, 100),
		lang:  new Button(alterLang,    963,  203, 100, 100),
		audio: new Button(toggleAudio, 1158,  203, 100, 100)
	};

	function ClickHandler(e) {
		var handler;
		this.handler = null;
		if (!clipboardVisible) {
			handler = FactoryFloor.getHandler(e);
			if (handler !== null) {
				this.handler = handler;
			}
		}
	}

	ClickHandler.prototype.onRelease = function (e) {
		var handler, offs, r, x, y;

		handler = this.handler;
		if (handler !== null) {
			handler.onRelease(e);
			return;
		}
			
		if (e.isTap && clipboardVisible) {
			offs = $('#main_container').offset();
			r = 2048 / $('#main_container').width();
			x = r * (e.pageX - offs.left);
			y = r * (e.pageY - offs.top);
			if (x >= 398 && y >= 172 && x < 398 + 1252 && y < 1338) {
				// clicked in clipboard - maybe clicked a button?
				$.each(clipboardButtons, function (key, b) {
					var dx, dy;
					dx = x - b.x;
					dy = y - b.y;
					if (dx >= 0 && dy >= 0 && dx < b.width && dy < b.height) {
						console.log('clicked', key);
						e.preventDefault();
						b.onClick();
						return false;
					}
				});
			} else {
				// clicked outside clipboard - hide it
				e.preventDefault();
				Clipboard.setVisible(false);
			}
		}
	};

	function setUpLevel(){
		makePages();
		Translator.addListener(makePages);
		$('#hint').fadeTo('slow', '0.5');
		$('#showLevels').fadeTo('slow', '0.5');
		$('#prev').fadeTo('slow', '0.5');
		$('#cliptip').hide();
		$('#circuit').hide();
		$('#factory').hide();
		Circuit.setInterfaceEnabled(false);
	}

	function createPage(index) {
		var ret = $('<div></div>').addClass('page');
		ret.attr('id', 'page' + index);
		if (index === 0) {
			ret.append($('<h1></h1>').text("Electra's Candy Factory"));
		} else if (index < 3) {
			ret.append($('<table></table>').addClass('levels')
				.append($('<tbody></tbody>').attr('id', 'levels' + index)));
		}
		return ret;
	}

	function configureClipboard() {
		var parent, i, imgSrc;
		parent = $('#clipboard');
		imgSrc = imgpath.get('resource/clipboard/clipboard', ['svg', 'png']);
		parent.append($('<img></img>').attr('id', 'boardImage').attr('src', imgSrc));
		imgSrc = imgpath.get('resource/clipboard/clipclip', ['svg', 'png']);
		parent.append($('<img></img>').attr('id', 'clipImage').attr('src', imgSrc));
		for (i = 0; i <= CREDITS_PAGE; i += 1) {
			parent.append(createPage(i));
		}
	}

	function createLevelLoader(levIndex) {
		return function (e) {
			e.preventDefault();
			goToPage(LEVEL1_PAGE + levIndex);
		};
	}

	function loadText() {
		$('#levels1').empty();
		$('#levels2').empty();

		$.each(all_levels, function (i, level) {
			var onClick, id, title, text, hint, tocRow, order;

			onClick = createLevelLoader(i);
			id = level.levelid;
			title = Translator.getText('levels', level.levelname);
			text = Translator.getText('levels', level.orderText);
			hint = Translator.getText('levels', level.hint);

			tocRow = $('<tr></tr>').addClass('tocRow');
			tocRow.attr('id', 'row' + id);
			tocRow.append($('<td></td>').addClass('tocNumber')
				.append($('<a></a>').attr('href', '#').click(onClick).text(id + '.')));
			tocRow.append($('<td></td>').addClass('tocTitle')
				.append($('<a></a>').attr('href', '#').click(onClick).text(title)));
			tocRow.append($('<td></td>').addClass('checkmark'));
			if (i < 10) {
				$('#levels1').append(tocRow);
			} else {
				$('#levels2').append(tocRow);
			}

			order = $('#page' + (id + 2)).empty();
			order.append($('<div></div>').addClass('levelname')
				.text(id + '. ' + title));
			order.append($('<div></div>').addClass('order').text(text));
			order.append($('<div></div>').addClass('hintText').text('Hint: ' + hint));
			order.append($('<div></div>').addClass('complete').text('Complete'));
		});

		$('.page').hide();
		$('.hintText').hide();
		$('.complete').hide();
		$('#page' + curIndex).show();
	}

	var my = {};

	my.setVisible = function (value) {
		var moveBy, w, x, newY;
		if (clipboardVisible !== value) {
			clipboardVisible = value;
			w = $('#main_container').width();
			x = -(2048 - w) / 2;
			newY = x / 1.5;
			if (!value) {
				newY += 0.9 * w / 1.5;
			}
			console.log('setVisible', value, newY, $('#clipboard').offset().top);
			$('#clipboard').animate({top: newY}, 500);
			Circuit.setInterfaceEnabled(!value);
		}
	};

	my.windowResized = function (w, time) {
		var x, y;
		x = -(2048 - w) / 2;
		y = x / 1.5;
		if (!clipboardVisible) {
			y += 0.9 * w / 1.5;
		}
		$('#clipboard').stop().animate({ left: x, top: y,
			transform: 'scale(' + (w / 2048)  + ')' }, time);
	};

	my.goToPage = goToPage;

	my.isInClipboardTip = function (x, y) {
		var elt, r, offs0, x0, y0, dx, dy;
		elt = $('#clipboard');
		r = 2048.0 / elt.parent().width();
		offs0 = elt.parent().offset();
		x0 = r * (x - offs0.left);
		y0 = 1.9 * 1365.33 - r * (y - offs0.top);
		dx = x0 - 1024.0; // relative to center of tip's circle
		dy = y0 - 1246.77;
		console.log('isInTip', x0, y0, dx, dy);
		return dx * dx + dy * dy < 10000.0;
	}

	$(document).ready(function () {
		configureClipboard();
		loadText();
		multidrag.create(ClickHandler).register($('#boardImage'));
		multidrag.create(ClickHandler).register($('#clipImage'));
		Circuit.setInterfaceEnabled(false);
	});

	return my;
}(jQuery, Translator, all_levels, LevelSelector, Audio));
