var Letterbox = (function ($) {
	var my = {};
	
	my.configure = function (jqElt, widthToHeight, resizeCallback, options) {
		"use strict";
		var lastWMax, lastHMax, resizeTimer, border;

		lastWMax = -1;
		resizeTimer = null;
		border = 0;
		if (options && options.hasOwnProperty('border')) {
			border = options.border;
		}

		function resizeElt() {
			var body, wMax, hMax, x0, y0, w, h, bv, bh, time;
			body = $('body');
			wMax = body.width();
			hMax = body.height();
			if (hMax === lastHMax && wMax === lastWMax) {
				return;
			}
			if (lastWMax < 0) {
				time = 1;
			} else {
				time = 100;
			}
			lastHMax = hMax;
			lastWMax = wMax;
			if (wMax < hMax * widthToHeight) { // too tall - size based on wMax
				w = wMax;
				h = Math.floor(wMax / widthToHeight);
				x0 = 0;
				y0 = (hMax - h) / 2;
			} else { // too wide - size based on hMax
				w = Math.floor(hMax * widthToHeight);
				h = hMax;
				x0 = (wMax - w) / 2;
				y0 = 0;
			}
			bh = Math.min(border, Math.floor((hMax - h) / 2.0));
			bv = Math.min(border, Math.floor((wMax - w) / 2.0));
			jqElt.css('border-width', 0);
			clearTimeout(resizeTimer);
			resizeCallback(w, time);
			resizeTimer = setTimeout(function () {
				jqElt.stop().animate({
					width: w,
					height: h,
					left: x0,
					top: y0
				}, time * 5, function () {
					jqElt.css('border-top-width', bh);
					jqElt.css('border-bottom-width', bh);
					jqElt.css('border-left-width', bv);
					jqElt.css('border-right-width', bv);
				});
			}, time);
		}

		$(window).resize(resizeElt);
		resizeElt();
	};

	return my;
}(jQuery));
