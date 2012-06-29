$(document).ready(function () {
	"use strict";
	configureLetterbox($('#main_container'), 1.5, function (w, time) {
	    FactoryFloor.windowResized(w, time);
	    Circuit.windowResized(w, time); 
	    Clipboard.windowResized(w, time);
		setTimeout(Tutorial.update, time + 200);
	});	 
});
