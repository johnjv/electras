var Workshop = {};

(function (my, $) {
	"use strict";
	function removeArray(arrayData, toRemove) {
		var i;
		for (i = arrayData.length - 1; i >= 0; i -= 1) {
			if (arrayData[i] === toRemove) {
				arrayData.splice(i, 1);
			}
		}
	}

	my.Connection = function (input, x, y, dx, dy) {
		this.id = -1; // integer - should be unique to each output in layout
		this.input = input; // Boolean value
		this.x = x; // offset of connection relative to element origin
		this.y = y;
		this.dx = dx; // length of stub
		this.dy = dy;
		this.elt = null; // element to which this Connection applies
		this.conns = []; // list of Connections to which this one connects
		this.stub = null; // graphical stub connecting to image
		this.circ = null; // graphical circle for connections
		this.line = null; // graphical connecting line - only applicable if input
	};

	my.ElementType = function (id, imgName, iX, iY, iW, iH, connections,
			propagate, options) {
		this.id = id; // string: and/or/not/R/G/Y/C/o/-/|/output
		this.imgName = imgName; // string: image name
		this.imgX = iX;
		this.imgY = iY;
		this.imgWidth = iW;
		this.imgHeight = iH;
		this.conns = connections;
		this.propagate = propagate;
		this.poke = function () { return false; }
		this.updateImage = this.poke;
		if (options) {
			if (options.poke) {
				this.poke = options.poke;
			}
			if (options.updateImage) {
				this.updateImage = options.updateImage;
			}
		}
	};

	my.Element = function (type, x, y) {
		var elt, conns;

		this.id = -1; // unique integer
		this.type = type; // ElementType reference
		this.x = x;
		this.y = y;
		this.imgElt = null; // graphical HTML5 image element

		elt = this;
		conns = [];
		$.each(type.conns, function (i, conn) {
			var copy = new my.Connection(conn.input, conn.x, conn.y,
				conn.dx, conn.dy);
			copy.elt = elt;
			conns.push(copy);
		});
		this.conns = conns;
	};

	my.Element.prototype.propagate = function (state) {
		this.type.propagate(this, state);
	};

	my.Layout = function () {
		this.maxEltId = -1;
		this.maxConnId = -1;
		this.elts = [];
	};

	my.Layout.prototype.addElement = function (elt) {
		var id;

		id = this.maxEltId + 1;
		this.maxEltId = id;
		elt.id = id;

		id = this.maxConnId;
		$.each(elt.conns, function (i, conn) {
			id += 1;
			conn.id = id;
		});
		this.maxConnId = id;

		this.elts.push(elt);
	};

	my.Layout.prototype.removeElement = function (elt) {
		$.each(elt.conns, function (i, conn) {
			var j, c1;
			for (j = conn.conns.length - 1; j >= 0; j -= 1) {
				c1 = conn.conns[j];
				removeArray(c1.conns, conn);
			}
		});
		removeArray(this.elts, elt);
	};

	my.Layout.prototype.addWire = function (conn0, conn1) {
		var t;
		if (conn0.input === conn1.input) {
			if (conn0.input) {
				throw new Error('Cannot connect inputs');
			} else {
				throw new Error('Cannot connect outputs');
			}
		}
		if ($.inArray(conn0.conns, conn1) < 0) {
			conn0.conns.push(conn1);
		}
		if ($.inArray(conn1.conns, conn0) < 0) {
			conn1.conns.push(conn0);
		}
	};

	my.Layout.prototype.removeWire = function (conn0, conn1) {
		removeArray(conn0.conns, conn1);
		removeArray(conn1.conns, conn0);
	};
}(Workshop, jQuery));
