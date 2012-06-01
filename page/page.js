var transitionCut, transitionNext, transitionPrev;

(function ($) {
	"use strict";
	
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

	transitionCut = function (src, dst) {
		positionPage(dst);
		dst.show();
		if (src) {
			src.hide();
		}
	};

	transitionNext = function (src, dst) {
		var d = Math.floor(dst.parent().height() / 2);
		src.css('z-index', 2);
		dst.css('z-index', 1);
		positionPage(dst);
		dst.show();
		src.stop().animate({
			top: '-=' + d + 'px',
			transform: 'scale(1, 0.01)'
		}, 1000, function () {
			src.hide();
			src.css('z-index', 0);
		});
	};

	transitionPrev = function (src, dst) {
		var d = Math.floor(dst.parent().height() / 2);
		src.css('z-index', 1);
		dst.css('z-index', 2);
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
	};
}(jQuery));
