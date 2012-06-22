var Clipboard = (function ($, Translator, all_levels, LevelSelector, Audio) {
	"use strict";

	var CREDITS_PAGE = 23;
	
	var clipboardVisible = true;

	function checkComplete(){
		var level = LevelSelector.getCurrentLevel();
		var page = LevelSelector.getCurrentPage();
		if (level.complete) {
			$('#row' + level.levelid).children('.checkmark').html('<img id = "check" src = "../levels/images/checkmark.png">');
			$('#page' + page).children('.complete').show();
		}
	}

	function positionPage(page) {
		var vpad, hpad;
		vpad = page.innerHeight() - page.height();
		hpad = page.innerWidth() - page.width();
		page.height(page.parent().height() - vpad);
		page.width(page.parent().width() - hpad);
		page.css('top', '-' + page.css('border-top-width'));
		page.css('left', '-' + page.css('border-left-width'));
		page.css('transform', 'scale(1)');
	}

	function transitionCut(src, dst) {
		positionPage(dst);
		dst.show();
		if (src) {
			src.hide();
		}
	}

	function transitionNext(src, dst) {
		var d = Math.floor(dst.parent().height() / 2);
		src.css('z-index', 52);
		dst.css('z-index', 51);
		positionPage(dst);
		dst.show();
		src.stop().animate({
			top: '-=' + d + 'px',
			transform: 'scale(1, 0.01)'
		}, 1000, function () {
			src.hide();
			src.css('z-index', 0);
		});
	}

	function transitionPrev(src, dst) {
		var d = Math.floor(dst.parent().height() / 2);
		src.css('z-index', 51);
		dst.css('z-index', 52);
		positionPage(dst);
		dst.css('top', '-=' + d + 'px');
		dst.css('transform', 'scale(1, 0.01)');
		dst.show();
		dst.stop().animate({
			top: '+=' + d + 'px',
			transform: 'scale(1)'
		}, 1000, function () {
			src.hide();
		});
	}


	function goToPage(pageIndex) {
		var oldIndex, oldPage, newPage;
		checkComplete();
		if (pageIndex >= 0 && pageIndex < CREDITS_PAGE) {
			oldIndex = LevelSelector.getCurrentPage();
			oldPage = $('#page' + oldIndex);
			newPage = $('#page' + pageIndex);

			LevelSelector.setPage(pageIndex);
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
			} else {
				$('#circuit').show();
				$('#factory').show();
				clipboardButtons.hint.setEnabled(true);
				clipboardButtons.level.setEnabled(true);
				FactoryFloor.updateLayout();
				LevelSelector.setLevel(all_levels[pageIndex - 3]);
			}
			$('.hintText').hide();
		} else if (pageIndex === CREDITS_PAGE) {
			oldIndex = LevelSelector.getCurrentPage();
			oldPage = $('#page' + oldIndex);

			LevelSelector.setPage(pageIndex);
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
		var curPage = LevelSelector.getCurrentPage();
		if (curPage > 0) {
			goToPage(curPage - 1);
		}
	}

	function goNext() {
		var curPage = LevelSelector.getCurrentPage();
		if (curPage < CREDITS_PAGE) {
			goToPage(curPage + 1);
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
		if (LevelSelector.getCurrentPage() >= 3) {
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
			FactoryFloor.setEnabled(false);
			console.log('Sound off');
		} else {
			sound.attr('src', '../levels/images/soundon.png');
			Audio.setEnabled(true);
			console.log('Sound on');
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
		console.log('in click handler');
	}

	ClickHandler.prototype.onRelease = function (e) {
		var clip, offs, r, x, y;
		console.log('in click release');
		if (e.isTap) {
			offs = $('#main_container').offset();
			r = $('#main_container').width() / 2048;
			x = (e.pageX - offs.left) / r;
			y = (e.pageY - offs.top) / r;
			console.log('at', x, y, e.pageX, e.pageY, r, clipboardVisible);
			if (!clipboardVisible) {
				if (x >= 1000 && x < 1048 && y >= 1275) {
					e.preventDefault();
					Clipboard.setVisible(true);
				}
			} else if (x >= 398 && y >= 172 && x < 398 + 1252 && y < 1338) {
				console.log('checking buttons');
				// clicked in clipboard - maybe clicked a button?
				$.each(clipboardButtons, function (key, b) {
					var dx, dy;
					dx = x - b.x;
					dy = y - b.y;
					console.log('checking', key);
					if (b.onClick === goNext) {
						console.log('goNext:', dx, dy, b.width, b.height);
					}
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
		FactoryFloor.updateLayout();
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
		parent.append($('<img></img>').attr('id', 'clipImage').attr('src', imgSrc));
		for (i = 0; i <= CREDITS_PAGE; i += 1) {
			parent.append(createPage(i));
		}
	}

	function loadText() {
		$('#levels1').empty();
		$('#levels2').empty();

		$.each(all_levels, function (i, level) {
			var id, title, text, hint, tocRow, order;

			id = level.levelid;
			title = Translator.getText('levels', level.levelname);
			text = Translator.getText('levels', level.orderText);
			hint = Translator.getText('levels', level.hint);

			tocRow = $('<tr></tr>').addClass('rows');
			tocRow.attr('id', 'row' + id);
			tocRow.append($('<td></td>').addClass('selectName')
				.text(id + '. ' + title));
			tocRow.append($('<td></td>').addClass('checkmark'));
			if (i < 10) {
				$('#levels1').append(tocRow);
			} else {
				$('#levels2').append(tocRow);
			}

			order = $('#page' + (id + 2)).empty();
			order.append($('<div></div>').addClass('levelname')
				.text(id + '. ' + title));
			order.append($('<div></div>').addClass('order').text('Order: ' + text));
			order.append($('<div></div>').addClass('hintText').text('Hint: ' + hint));
			order.append($('<div></div>').addClass('complete').text('Complete'));
		});
		addLevelClicks();

		$('.page').hide();
		$('.hintText').hide();
		$('.complete').hide();
		$('#page' + LevelSelector.getCurrentPage()).show();
	}

	function addLevelClicks(){
		var i;
		for (i = 1; i < 3; i += 1) {
			$('#tbody' + i).children().each(function (i, child) {
				function Kid(e) {
					e.preventDefault();
				}

				Kid.prototype.onRelease = function (e) {
					var page;

					if (e.isTap) {
						e.preventDefault();
						page = LevelSelector.getCurrentPage();
						if (page === 1) {
							goToPage(i + 3);
						} else {
							goToPage(i + 13);
						}
						FactoryFloor.updateLayout();
						checkComplete();
					}
				};

				multidrag.register($(child), Kid);
			});
		}
	}

	var my = {};

	my.setVisible = function (value) {
		var moveBy, newY;
		console.log('Clipboard.setVisible', value);
		if (clipboardVisible !== value) {
			clipboardVisible = value;
			if (value) {
				newY = '-=' + 0.9 * $('#main_container').height();
			} else {
				newY = '+=' + 0.9 * $('#main_container').height();
			}
			$('#clipboard').animate({ top: newY }, 500);
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

	$(document).ready(function () {
		configureClipboard();
		loadText();
		multidrag.register($('#clipboard'), ClickHandler);
		Circuit.setInterfaceEnabled(false);
	});

	return my;
}(jQuery, Translator, all_levels, LevelSelector, Audio));
