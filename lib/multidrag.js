var multidrag = {};

multidrag.id = -1;

multidrag.create = function (handlerMaker) {
	var ret, eltRegistered, touchHandler, touchX, touchY, mouseHandler;
	
	eltRegistered = null;
	touchHandler = null;
	mouseHandler = null;

	multidrag.id += 1;
	ret = { id: multidrag.id };
	ret.touchStart = function (e) {
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
	};
	ret.touchMove = function (e) {
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
	};
	ret.touchEnd = function (e) {
		var handler, touches;
		handler = touchHandler;
		touches = e.originalEvent.changedTouches;
		if (handler && touches.length >= 1 &&
				touches[0].pageX === touchX &&
				touches[0].pageY === touchY) {
			touchHandler = null;
			if (handler.onRelease) {
				e.pageX = touchX;
				e.pageY = touchY;
				handler.onRelease(e);
			}
		}
	};
	ret.mouseDown = function (e) {
		var handler;
		handler = mouseHandler;
		if (!handler) {
			handler = new handlerMaker(e);
			mouseHandler = handler;
		}
	};
	ret.mouseMove = function (e) {
		var handler;
		handler = mouseHandler;
		if (handler && handler.onDrag) {
			handler.onDrag(e);
		}
	};
	ret.mouseUp = function (e) {
		var handler;
		handler = mouseHandler;
		if (handler) {
			mouseHandler = null;
			if (handler.onRelease) {
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
