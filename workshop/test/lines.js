$(document).ready(function () {
	var canv, paper;

	canv = $('#canv');
	paper = Raphael("canv", canv.width(), canv.height());

	function DrawLine(e) {
		// An object is created each time the user presses the
		// mouse or touches the screen, passing the event as a
		// parameter. The event has pageX and pageY fields
		// saying where the event occurred, in page coordinates.
		e.preventDefault();
		this.pos0 = 'M' + e.pageX + ',' + e.pageY;
		this.path = paper.path(this.pos0);
	};

	DrawLine.prototype.onDrag = function (e) {
		// The object's onDrag method is called each time the
		// user moves the mouse (with the button pressed) on
		// moves the finger. Again, the parameter event has pageX and pageY
		// fields saying where the event occurred, in page coordinates.
		var newpath;

		e.preventDefault();
		newpath = paper.path(this.pos0 + 'L' + e.pageX + ',' + e.pageY);
		newpath.attr({
			'stroke-dasharray': '-',
			'stroke-linecap': 'round',
			'stroke-width': 4,
		});
		this.path.remove();
		this.path = newpath;
	};

	DrawLine.prototype.onRelease = function (e) {
		// The object's onRelease method is called when the
		// releases the mouse button or removes the finger from
		// the screen.  Again, the parameter event has pageX and pageY
		// fields saying where the event occurred, in page coordinates.
		// It also has an "isTap" field that is true or false
		// depending on whether the user has 'tapped' the screen
		// (i.e., has not dragged very far from the initial location).

		// In this example, we have nothing to do when the drag completes.
	};

	// Now we register the DrawLine class as the one to be
	// instantiated each time the user starts to drag the mouse
	// within the "canv" element on the screen.
	multidrag.register(canv, DrawLine);
});
