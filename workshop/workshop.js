if (typeof Circuit === 'undefined') {
	Circuit = false;
}

(function ($, Workshop, Circuit) {
	"use strict";

	if (Circuit) {
		return;
	}


	$(document).ready(function () {
		var main, workshop;

		main = $('#circuit');
		if (!main.hasClass('circ-container')) {
			workshop = new Workshop.Workshop(main, $('#circuit_iface'));
			workshop.setTools(['and', 'or', 'not', 'in', 'out', 'eraser']);
		}

		$(window).resize(function () {
			var container;
			container = $('#circuit');
			workshop.setSize(container.width(), container.height());
		});
	});
}(jQuery, Workshop, Circuit));
