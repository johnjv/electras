var multidrag = {};

multidrag.register = function (jqElt, handlerMaker) {
	var touchHandler, touchX, touchY, mouseHandler;
	
	touchHandler = null;
	mouseHandler = null;

	jqElt.bind('touchstart', function (e) {
		var handler, touches;
		handler = touchHandler;
		touches = e.originalEvent.touches;
		if (touches.length === 1 && !handler) {
			touchX = touches[0].pageX;
			touchY = touches[0].pageY;
			e.pageX = touchX;
			e.pageY = touchY;
			handler = new handlerMaker(e);
			touchHandler = handler;
		}
	});
	jqElt.bind('touchmove', function (e) {
		var handler, touches;
		handler = touchHandler;
		touches = e.originalEvent.touches;
		if (handler && touches.length > 0) {
			touchX = touches[0].pageX;
			touchY = touches[0].pageY;
			if (handler.onDrag) {
				e.pageX = touchX;
				e.pageY = touchY;
				handler.onDrag(e);
			}
		}
	});
	jqElt.bind('touchend', function (e) {
		var touches;
		handler = touchHandler;
		touches = e.originalEvent.changedTouches;
		if (handler && touches.length >= 1
				&& touches[0].pageX === touchX
				&& touches[0].pageY === touchY) {
			touchHandler = null;
			if (handler.onRelease) {
				e.pageX = touchX;
				e.pageY = touchY;
				handler.onRelease(e);
			}
		}
	});
	jqElt.mousedown(function (e) {
		var handler;
		handler = mouseHandler;
		if (!handler) {
			handler = new handlerMaker(e);
			mouseHandler = handler;
		}
	});
	jqElt.mousemove(function (e) {
		var handler;
		handler = mouseHandler;
		if (handler && handler.onDrag) {
			handler.onDrag(e);
		}
	});
	jqElt.mouseup(function (e) {
		var handler;
		handler = mouseHandler;
		if (handler) {
			mouseHandler = null;
			if (handler.onRelease) {
				handler.onRelease(e);
			}
		}
	});
};
