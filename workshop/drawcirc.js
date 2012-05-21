(function (my, $) {
	"use strict";
	var WIRE_WIDTH = 3;
	var CONNECT_RADIUS = 3;
	
	function setterImage(elt) {
		return function (imgName) {
			var newName = 'resource/' + imgName + '.png';
			if (elt.imgElt.attr('src') !== newName) {
				elt.imgElt.attr('src', newName);
			}
		};
	}

	my.DrawCirc = {};

	my.DrawCirc.createElement = function (info, elt) {
		var type, img, offs0;

		if (elt.imgElt) {
			elt.imgElt.remove();
		}

		type = elt.type;
		img = $('<img></img>').addClass('on_canvas');
		elt.imgElt = img;
		elt.setImage = setterImage(elt);
		elt.setImage(type.imgName);
		img.width(type.imgWidth);
		img.height(type.imgHeight);
		info.canvas.append(img);
		offs0 = info.canvas.offset();
		img.offset({ left: offs0.left + elt.x + elt.type.imgX,
			top: offs0.top + elt.y + elt.type.imgY });

		$.each(elt.conns, function (i, conn) {
			my.DrawCirc.createStub(info, conn);
		});
	};

	my.DrawCirc.removeElement = function (info, elt) {
		$.each(elt.conns, function (i, conn) {
			if (conn.circ !== null) {
				conn.circ.remove();
			}
			if (conn.stub !== null) {
				conn.stub.remove();
			}
		});
		elt.imgElt.remove();
	};

	my.DrawCirc.repositionElement = function (info, elt) {
		var type, offs0, img;

		type = elt.type;
		offs0 = info.canvas.offset();
		elt.imgElt.offset({ left: offs0.left + elt.x + elt.type.imgX,
			top: offs0.top + elt.y + elt.type.imgY });

		$.each(elt.conns, function (i, conn) {
			my.DrawCirc.createStub(info, conn);
		});
	};

	my.DrawCirc.createStub = function (info, conn) {
		var cx, cy, dx, dy;

		if (conn.circ !== null) {
			conn.circ.remove();
		}
		if (conn.stub !== null) {
			conn.stub.remove();
		}

		cx = conn.elt.x + conn.x;
		cy = conn.elt.y + conn.y;
		dx = cx + conn.dx;
		dy = cy + conn.dy;
		if (conn.input) {
			conn.circ = info.paper.circle(cx, cy, CONNECT_RADIUS);
		} else {
			conn.circ = info.paper.circle(cx, cy, CONNECT_RADIUS);
			conn.circ.attr('fill', 'black');
		}
		if (conn.circ !== null) {
			if (conn.dx > 0) {
				cx += CONNECT_RADIUS;
			} else if (conn.dx < 0) {
				cx -= CONNECT_RADIUS;
			}
			if (conn.dy > 0) {
				cy += CONNECT_RADIUS;
			} else if (conn.dy < 0) {
				cy -= CONNECT_RADIUS;
			}
		}
		conn.stub = info.paper.path('M' + cx + ',' + cy
			+ 'L' + dx + ',' + dy);
		conn.stub.attr('stroke-width', WIRE_WIDTH);
		if (conn.conns.length > 0) {
			conn.stub.hide();
			if (conn.input) {
				conn.circ.hide();
			}
		}
		my.DrawCirc.recolorConnection(info, conn);
	};

	my.DrawCirc.hideStub = function (info, conn) {
		if (conn) {
			conn.stub.hide();
			if (conn.circ) {
				conn.circ.hide();
			}
		}
	};

	my.DrawCirc.showStub = function (info, conn) {
		if (conn) {
			conn.stub.show();
			if (conn.circ) {
				conn.circ.show();
			}
		}
	};

	my.DrawCirc.createWire = function (info, conn0, conn1) {
		var c0, c1, x0, y0, x1, y1, line;
		if (conn0.input) {
			c0 = conn1;
			c1 = conn0;
		} else {
			c0 = conn0;
			c1 = conn1;
		}
		x0 = c0.elt.x + c0.x;
		y0 = c0.elt.y + c0.y;
		x1 = c1.elt.x + c1.x;
		y1 = c1.elt.y + c1.y;
		line = info.paper.path('M' + (x0 + c0.dx) + ',' + (y0 + c0.dy) +
			'L' + x0 + ',' + y0 +
			'L' + x1 + ',' + y1 +
			'L' + (x1 + c1.dx) + ',' + (y1 + c1.dy));
		line.attr('stroke-width', WIRE_WIDTH);
		line.attr('stroke-linecap', 'round');
		c1.line = line;
		my.DrawCirc.recolorConnection(info, c0);
		return line;
	};

	my.DrawCirc.recolorConnection = function (info, conn) {
		var color;

		if (info.state && info.state.getValue(conn)) {
			color = '#0A0';
		} else {
			color = '#030';
		}
		if (conn.stub) {
			conn.stub.attr('stroke', color);
		}
		if (conn.circ) {
			conn.circ.attr('stroke', color);
			if (!conn.input) {
				conn.circ.attr('fill', color);
			}
		}
		$.each(conn.conns, function (i, c) {
			if (c.stub) {
				c.stub.attr('stroke', color);
			}
			if (c.circ) {
				c.circ.attr('stroke', color);
			}
			if (c.line) {
				c.line.attr('stroke', color);
			}
		});
	};

	my.DrawCirc.ghostWireToCoord = function (info, c0, x, y) {
		var x0, y0, line;
		x0 = c0.elt.x + c0.x;
		y0 = c0.elt.y + c0.y;
		line = info.paper.path('M' + (x0 + c0.dx) + ',' + (y0 + c0.dy) +
			'L' + x0 + ',' + y0 +
			'L' + x + ',' + y);
		line.attr('opacity', 0.5);
		line.attr('stroke-width', WIRE_WIDTH);
		return line;
	};

	my.DrawCirc.ghostWireToConn = function (info, c0, c1) {
		var x0, y0, x1, y1, line;
		x0 = c0.elt.x + c0.x;
		y0 = c0.elt.y + c0.y;
		x1 = c1.elt.x + c1.x;
		y1 = c1.elt.y + c1.y;
		line = info.paper.path('M' + (x0 + c0.dx) + ',' + (y0 + c0.dy) +
			'L' + x0 + ',' + y0 +
			'L' + x1 + ',' + y1 +
			'L' + (x1 + c1.dx) + ',' + (y1 + c1.dy));
		line.attr('opacity', 0.5);
		line.attr('stroke-width', WIRE_WIDTH);
		return line;
	};
}(Workshop, jQuery));
