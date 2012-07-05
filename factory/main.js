(function ($, Letterbox) {
	"use strict";

	function iosHideBar() {
		var currentWidth = 0; 

		function updateLayout() { 
			if (window.innerWidth != currentWidth) { 
				currentWidth = window.innerWidth; 

				var orient = currentWidth == 640 ? "profile" : "landscape"; 
				document.body.setAttribute("orient", orient); 
				setTimeout(function() { 
					window.scrollTo(0, 1); 
				}, 100); 
			} 
		} 

		$(document).load(function() { 
			setTimeout(updateLayout, 0); 
		}, false); 

		setInterval(updateLayout, 100); 
	}

	$(document).ready(function () {
		Letterbox.configure($('#main_container'), 1.5, function (w, time) {
			FactoryFloor.windowResized(w, time);
			Circuit.windowResized(w, time); 
			Clipboard.windowResized(w, time);
			setTimeout(Tutorial.update, time + 200);
		});
	});
}(jQuery, Letterbox));
