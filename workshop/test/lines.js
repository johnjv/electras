$(document).ready(function () {
	var body, canv, paper, onDrag, onUp;

	body = $('body');
	canv = $('#canv');
	paper = Raphael("canv", canv.width(), canv.height());
	onDrag = null;
	onUp = null;

	function DrawLine() {
		this.pos0 = 'M0,0';
		this.path = paper.path(pos0);
	}

	DrawLine.prototype.mouseDown = function (e) {
		this.pos0 = 'M' + e.pageX + ',' + e.pageY;
		this.path = paper.path(this.pos0);
	};

	DrawLine.prototype.mouseDrag = function (e) {
		var newpath;

		newpath = paper.path(this.pos0 + 'L' + x + ',' + y);
		newpath.attr({
			'stroke-dasharray': '-',
			'stroke-linecap': 'round',
			'stroke-width': 4,
		});
		this.path.remove();
		this.path = newpath;
	};

	DrawLine.prototype.mouseUp = function (e) { };

	multidrag.register(canv, DrawLine);

var multidrag = {};

multidrag.register = function (jqElt, handlerMaker) {
	var touchHandler, touchX, touchY;
	
	touchHandler = null;

	jqElt.bind('touchstart', function (e) {
		var touches, handler;
		handler = touchHandler;
		touches = e.originalEvent.touches;
		if (touches.length === 1 && !handler) {
			touchHandler = new handler();
			e.pageX = touches[0].pageX;
			e.pageY = touches[0].pageY;
			touchHandler.mouseDown(e);
		}
	});
	canv.bind('touchmove', function (e) {
		var touches, i, str;
		e.preventDefault();
		touches = e.originalEvent.touches;
		str = 'move';
		for (i = 0; i < touches.length; i += 1) {
			str += ' ' + touches[i].pageX + ',' + touches[i].pageY;
		}
		$('#trace').text(str);

		if (touchActive && onDrag) {
			touchX = touches[0].pageX;
			touchY = touches[0].pageY;
			onDrag(touchX, touchY);
		}
	});
	canv.bind('touchend', function (e) {
		var touches, i, str;
		e.preventDefault();
		touches = e.originalEvent.changedTouches;
		str = 'end';
		for (i = 0; i < touches.length; i += 1) {
			str += ' ' + touches[i].pageX + ',' + touches[i].pageY;
		}
		$('#trace').text(str);

		if (touchActive && onUp && touches.length > 1
				&& touches[0].pageX === touchX
				&& touches[0].pageY === touchY) {
			touchActive = false;
			onUp(touchX, touchY);
		}
		// mouseDown(touches[0].pageX, touches[0].pageX);
	});
	canv.mousedown(function (e) {
		mouseDown(e.pageX, e.pageY);
	});
	canv.mousemove(function (e) {
		if (onDrag) {
			onDrag(e.pageX, e.pageY);
		}
	});
	canv.mouseup(function (e) {
		if (onUp) {
			onUp(e.pageX, e.pageY);
		}
	});
});
