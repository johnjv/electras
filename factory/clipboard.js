var Clipboard = (function ($, Translator, multidrag, imgpath) {
	"use strict";

	var LEVEL0_PAGE = 3;
	var CREDITS_PAGE = 23;

	var clipboardVisible = true;
	var curIndex = 0;

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
		var oldIndex, oldPage, newPage, newLevel;
		oldIndex = curIndex;
		if (oldIndex === pageIndex) {
			return; // no change to make
		}
		if (pageIndex >= 0 && pageIndex < CREDITS_PAGE) {
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
				$('#circuit').fadeOut();
				$('#factory').fadeOut();
				clipboardButtons.hint.setEnabled(false);
				clipboardButtons.level.setEnabled(pageIndex === 0);
				LevelSelector.setLevel(null);
			} else {
				newLevel = allLevels[pageIndex - LEVEL0_PAGE];
				clipboardButtons.hint.setEnabled(!newLevel.hintShown);
				clipboardButtons.level.setEnabled(true);
				LevelSelector.setLevel(newLevel);
				$('#circuit').fadeIn();
				$('#factory').fadeIn();
				Circuit.setMinimized(false);
			}
		} else if (pageIndex === CREDITS_PAGE) {
			oldIndex = curIndex;
			curIndex = pageIndex;
			oldPage = $('#page' + oldIndex);
			newPage = $('#page' + pageIndex);

			LevelSelector.setLevel(null);
			CreditsPage.slideDesc(newPage);
			transitionNext(oldPage, newPage);
			clipboardButtons.hint.setEnabled(false);
			clipboardButtons.level.setEnabled(true);
			$('#circuit').fadeOut();
			$('#factory').fadeOut();
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
		if (lev === null) {
			goToPage(1);
		} else {
			goToPage(1 + Math.floor(lev.id / 10));
		}
	}

	function goInfo() {
		goToPage(CREDITS_PAGE);
	}

	function showHint() {
		var lev = LevelSelector.getCurrentLevel();
		if (lev !== null) {
			lev.hintShown = true;
			clipboardButtons.hint.setEnabled(false);
			$('#page' + (LEVEL0_PAGE + lev.id) + ' .levHint').fadeIn();
		}
	}

	function alterLang() {
		Translator.changeLanguage(Translator.getCurrentLanguage());
		//can only go from English to Korean, but cannot go back to English
	}

	function toggleAudio() {
		var b, src, elt;
		if (Audio.isEnabled()){ // turn audio off
			Audio.setEnabled(false);
			if ($('#clipSoundOff').size() === 0) {
				b = clipboardButtons.audio;
				src = imgpath.get('resource/clipboard/button_sound_off', ['svg', 'png']);
				elt = $('<img></img>').attr('id', 'clipSoundOff')
					.attr('src', src).css({width: b.width, height: b.height,
						left: b.x, top: 1365.33 - b.y - b.height});
				elt.hide().fadeIn();
				multidrag.create(ClickHandler).register(elt);
				$('#clipboard').append(elt);
			}
		} else {
			Audio.setEnabled(true);
			elt = $('#clipSoundOff');
			if (elt.size() > 0) {
				elt.fadeOut(function () { elt.remove(); });
			}
		}
	}

	function Button(onClick, x, y, w, h) {
		this.onClick = onClick;
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.enabled = true;
		this.fadeElt = $('<div></div>').addClass('clipButtonFade')
			.css({left: x, top: 1365.33 - y - h, width: w, height: h})
			.hide();
		$('#clipboard').append(this.fadeElt);
	}

	Button.prototype.doClick = function (value) {
		if (this.enabled) {
			this.onClick();
		}
	}

	Button.prototype.setEnabled = function (value) {
		if (value) {
			if (!this.enabled) {
				this.enabled = true;
				this.fadeElt.fadeOut();
			}
		} else {
			if (this.enabled) {
				this.enabled = false;
				this.fadeElt.fadeIn();
			}
		}
	};

	var clipboardButtons = {
		prev:  new Button(goPrev,       455,   48, 131, 132),
		level: new Button(goLevels,     633,   48, 131, 132),
		hint:  new Button(showHint,     811,   48, 131, 132),
		next:  new Button(goNext,       989,   48, 131, 132),
		info:  new Button(goInfo,      1166,   54, 120, 120),
		lang:  new Button(alterLang,   1332,   54, 120, 120),
		audio: new Button(toggleAudio, 1497,   54, 120, 120)
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
					dy = (1365.33 - y) - b.y;
					if (dx >= 0 && dy >= 0 && dx < b.width && dy < b.height) {
						e.preventDefault();
						console.log('clicked', b.onClick.name);
						b.doClick();
						return false;
					}
				});
			} else if (curIndex >= LEVEL0_PAGE && curIndex < CREDITS_PAGE) {
				// clicked outside clipboard - hide it
				e.preventDefault();
				Clipboard.setVisible(false);
			}
		}
	};

	function createPage(index) {
		var page = $('<div></div>').addClass('page');
		page.attr('id', 'page' + index);
		if (index === 0) {
			page.append($('<div></div>').attr('id', 'clipTitle'));
		} else if (index < LEVEL0_PAGE) {
			page.append($('<table></table>').addClass('levels')
				.append($('<tbody></tbody>').attr('id', 'levels' + index)));
		} else if (index === CREDITS_PAGE) {
			CreditsPage.configurePage(page);
		}
		return page;
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
			goToPage(LEVEL0_PAGE + levIndex);
		};
	}

	function loadTextTitle(page) {
		var t;
		t = Translator.getText('clipboard', 'title');
		$('#clipTitle', page).html(t);
		$('.clipCandy', page).attr('src',
			imgpath.get('resource/app/app_icon', ['svg', 'png']));
	}

	function loadText() {
		var checkpath;

		checkpath = imgpath.get('resource/clipboard/checkmark', ['svg', 'png']);

		loadTextTitle($('#page0'));
		$('#levels1').empty();
		$('#levels2').empty();

		$.each(allLevels, function (i, level) {
			var onClick, id, title, text, hint, tocRow, order, hint, check;

			onClick = createLevelLoader(i);
			id = level.id;
			title = Translator.getText('levels', level.title);
			text = Translator.getText('levels', level.orderText);
			hint = Translator.getText('levels', level.hint);

			tocRow = $('<tr></tr>').addClass('tocRow');
			tocRow.attr('id', 'tocRow' + id);
			check = $('<img></img>').attr('src', checkpath);
			if (!level.complete) {
				check.hide();
			}
			tocRow.append($('<td></td>').addClass('tocComplete').append(
				check));
			tocRow.append($('<td></td>').addClass('tocNumber').append(
				$('<a></a>').attr('href', '#').click(onClick)
					.text((id + 1) + '.')));
			tocRow.append($('<td></td>').addClass('tocTitle').append(
				$('<a></a>').attr('href', '#').click(onClick).text(title)));
			if (i < 10) {
				$('#levels1').append(tocRow);
			} else {
				$('#levels2').append(tocRow);
			}

			order = $('#page' + (LEVEL0_PAGE + id)).empty();
			order.append($('<div></div>').addClass('levTitle')
				.text((id + 1) + '. ' + title));
			order.append($('<div></div>').addClass('levOrder').text(text));
			hint = $('<div></div>').addClass('levHint').text('Hint: ' + hint);
			if (!level.showHint) {
				hint.hide();
			}
			order.append(hint);
			check = $('<div></div>').addClass('levComplete')
				.append($('<img></img>').attr('src', checkpath))
				.append('Complete');
			if (!level.complete) {
				check.hide();
			}
			order.append(check);
		});

		CreditsPage.loadText($('#page' + CREDITS_PAGE));

		$('.page').hide();
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
		return dx * dx + dy * dy < 10000.0;
	};

	function levelChanged(oldLevel, newLevel) { }

	levelChanged.completeChanged = function (level) {
		var id = level.id;
		if (level.complete) {
			$('#tocRow' + id + ' .tocComplete img').fadeIn();
			$('#page' + (LEVEL0_PAGE + id) + ' .levComplete').fadeIn();
		}
	}

	$(document).ready(function () {
		configureClipboard();
		loadText();
		multidrag.create(ClickHandler).register($('#boardImage'));
		multidrag.create(ClickHandler).register($('#clipImage'));
		Circuit.setInterfaceEnabled(false);
		LevelSelector.addListener(levelChanged);
	});

	return my;
}(jQuery, Translator, multidrag, imgpath));
