var multidrag = {};

multidrag.id = -1;

multidrag.create = function (handlerMaker, source) {
	var CLICK_MOUSE, CLICK_TAP, ret, eltRegistered, touchHandler,
		initX, initY, touchX, touchY, mouseHandler, provisional;

	if (typeof source === 'undefined' || source === null) {
		source = 'unknown';
	}
	
	CLICK_MOUSE = 5 * 5;
	CLICK_TAP = 10 * 10;

	eltRegistered = null;
	touchHandler = null;
	mouseHandler = null;
	maxD2 = 0;
	provisional = 'provisional';

	multidrag.id += 1;
	ret = { id: multidrag.id, source: source };
	ret.touchStart = function (e) {
		var handler, touches;
		handler = touchHandler;
		touches = e.originalEvent.touches;
		if (touches.length === 1 && !handler) {
			initX = touches[0].pageX;
			initY = touches[0].pageY;
			touchX = initX;
			touchY = initY;
			maxD2 = 0;
			e.pageX = touchX;
			e.pageY = touchY;
			touchHandler = provisional;
			handler = new handlerMaker(e);
			if (touchHandler === provisional) {
				touchHandler = handler;
			}
		}
	};
	ret.touchMove = function (e) {
		var handler, touches, dx, dy, d2;
		handler = touchHandler;
		touches = e.originalEvent.touches;
		if (handler && touches.length > 0) {
			touchX = touches[0].pageX;
			touchY = touches[0].pageY;
			dx = touchX - initX;
			dy = touchY - initY;
			d2 = dx * dx + dy * dy;
			if (d2 > maxD2) {
				maxD2 = d2;
			}
			if (handler.onDrag) {
				e.pageX = touchX;
				e.pageY = touchY;
				handler.onDrag(e);
			}
		}
	};
	ret.touchEnd = function (e) {
		var handler, touches;
		handler = touchHandler;
		touches = e.originalEvent.changedTouches;
		if (handler) {
			touchHandler = null;
			if (handler.onRelease) {
				e.pageX = touchX;
				e.pageY = touchY;
				e.isTap = maxD2 < CLICK_TAP;
				handler.onRelease(e);
			}
		}
	};
	ret.mouseDown = function (e) {
		var handler;
		handler = mouseHandler;
		console.log('mouseDown', handlerMaker, handler);
		if (!handler) {
			initX = e.pageX;
			initY = e.pageY;
			maxD2 = 0;
			mouseHandler = provisional;
			handler = new handlerMaker(e);
			if (mouseHandler === provisional) {
				mouseHandler = handler;
			}
		}
	};
	ret.mouseMove = function (e) {
		var handler, dx, dy, d2;
		handler = mouseHandler;
		if (handler) {
			dx = e.pageX - initX;
			dy = e.pageY - initY;
			d2 = dx * dx + dy * dy;
			if (d2 > maxD2) {
				maxD2 = d2;
			}
			if (handler.onDrag) {
				handler.onDrag(e);
			}
		}
	};
	ret.mouseUp = function (e) {
		var handler, dx, dy, d2;
		handler = mouseHandler;
		if (handler) {
			mouseHandler = null;
			dx = e.pageX - initX;
			dy = e.pageY - initY;
			d2 = dx * dx + dy * dy;
			if (d2 > maxD2) {
				maxD2 = d2;
			}
			if (handler.onRelease) {
				e.isTap = maxD2 < CLICK_MOUSE;
				handler.onRelease(e);
			}
		}
	};

	ret.unregister = function (jqElt) {
		var elt, handler;
		if (eltRegistered !== null) {
			elt = jqElt || eltRegistered;
			eltRegistered = null;
			elt.unbind('touchstart', ret.touchStart);
			elt.unbind('touchmove', ret.touchMove);
			elt.unbind('touchend', ret.touchEnd);
			elt.unbind('mousedown', ret.mouseDown);
			elt.unbind('mousemove', ret.mouseMove);
			elt.unbind('mouseup', ret.mouseUp);

			handler = mouseHandler;
			if (handler && handler.cancel) {
				handler.cancel();
			}
			mouseHandler = null;
			handler = touchHandler;
			if (handler && handler.cancel) {
				handler.cancel();
			}
			touchHandler = null;
		}
		return ret;
	};

	ret.register = function (jqElt) {
		if (eltRegistered !== jqElt) {
			eltRegistered = jqElt;
			jqElt.bind('touchstart', ret.touchStart);
			jqElt.bind('touchmove', ret.touchMove);
			jqElt.bind('touchend', ret.touchEnd);
			jqElt.bind('mousedown', ret.mouseDown);
			jqElt.bind('mousemove', ret.mouseMove);
			jqElt.bind('mouseup', ret.mouseUp);
		}
		return ret;
	};

	return ret;
};

multidrag.register = function (jqElt, handlerMaker) {
	return multidrag.create(handlerMaker).register(jqElt);
};
