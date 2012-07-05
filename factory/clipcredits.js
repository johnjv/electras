var CreditsPage = (function ($) {
	"use strict";

	var NUM_DIVS = 6;

	var my = {};

	my.configurePage = function (page) {
		var divs, i;
		page.addClass('creditsPage');
		page.append($('<div></div>').attr('id', 'creditsTitle'));
		for (i = 0; i < NUM_DIVS; i += 1) {
			page.append($('<div></div>').attr('id', 'creditsDiv' + i)
				.addClass('creditsDiv').hide());
		}
		my.loadText(page);
	};

	my.loadText = function (page) {
		var i, t;
		t = Translator.getText('clipboard', 'title');
		$('#creditsTitle', page).html(t);
		for (i = 0; i < NUM_DIVS; i += 1) {
			t = Translator.getText('clipboard', 'credits' + i);
			$('#creditsDiv' + i, page).html(t);
		}
		$('.clipCandy', page).attr('src',
			imgpath.get('resource/app/app_icon', ['svg', 'png']));
		$('#creditsHlogo', page).attr('src',
			imgpath.get('resource/clipboard/hendrix-logo', ['svg', 'png']));
	};

	my.slideDesc = function (page) {
		$('.creditsDiv').stop(true).hide();
    	slideDivs(page, 0);
    }

	function slideDivs(page, i) {
		var curDiv, transitionNext;
		curDiv = $('#creditsDiv' + i, page);
		transitionNext = sliderNext(page, i, curDiv);
		curDiv.stop()
			.css('left', -page.width())
			.show()
			.animate({left: 0}, 1000)
			.delay(4000)
			.animate({left: 1}, 1, transitionNext)
			.animate({left: page.width() - 1}, 999);
	}

	function sliderNext(page, i, curDiv) {
		return function () {
			if (i < NUM_DIVS - 1) {
				slideDivs(page, i + 1);
			} else {
				slideDivs(page, 0);
			}
		};
	}

	return my;
}(jQuery));
