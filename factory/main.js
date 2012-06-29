(function ($, Letterbox, FactoryFloor, Circuit, Clipboard, Tutorial) {
	"use strict";

	$(document).ready(function () {
		Letterbox.configure($('#main_container'), 1.5, function (w, time) {
			FactoryFloor.windowResized(w, time);
			Circuit.windowResized(w, time); 
			Clipboard.windowResized(w, time);
			setTimeout(Tutorial.update, time + 200);
		});
	});
}(jQuery, Letterbox, FactoryFloor, Circuit, Clipboard, Tutorial));
