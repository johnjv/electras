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

	my.Port = function (input, x, y, dx, dy) {
		this.id = -1; // integer - should be unique to each output in layout
		this.input = input; // Boolean value
		this.x = x; // offset of port relative to element origin
		this.y = y;
		this.dx = dx; // length of stub
		this.dy = dy;
		this.elt = null; // element to which this Port applies
		this.ports = []; // list of Ports to which this one connects
		this.stub = null; // graphical stub connecting to image
		this.circ = null; // graphical circle for connections
		this.line = null; // graphical connecting line - only applicable if input
	};

	my.Port.prototype.getLocation = function () {
		var elt = this.elt;
		return [elt.x + this.x, elt.y + this.y];
	};

	my.ElementType = function (id, imgName, iX, iY, iW, iH, ports,
			propagate, options) {
		this.id = id; // string: and/or/not/R/G/Y/C/o/-/|/output
		this.imgName = imgName; // string: image name
		this.imgX = iX;
		this.imgY = iY;
		this.imgWidth = iW;
		this.imgHeight = iH;
		this.ports = ports;
		this.propagate = propagate;
		this.poke = function () { return false; };
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
		var elt, ports;

		this.id = -1; // unique integer
		this.type = type; // ElementType reference
		this.x = x;
		this.y = y;
		this.imgElt = null; // graphical HTML5 image element

		elt = this;
		ports = [];
		$.each(type.ports, function (i, port) {
			var copy = new my.Port(port.input, port.x, port.y,
				port.dx, port.dy);
			copy.elt = elt;
			ports.push(copy);
		});
		this.ports = ports;
	};

	my.Element.prototype.propagate = function (state) {
		this.type.propagate(this, state);
	};

	my.Element.prototype.forEachAttachedWire = function (callback) {
		var j, pj, k, ret;
		for (j = this.ports.length - 1; j >= 0; j -= 1) {
			pj = this.ports[j];
			for (k = pj.ports.length - 1; k >= 0; k -= 1) {
				ret = callback(pj, pj.ports[k]);
				if (ret === false) {
					return false;
				}
			}
		}
	};

	my.Element.prototype.findElements = function (traverseInput, addTo,
			mapTo) {
		var found, fringe, elt, j, pj, k, ek;
		found = addTo || {};
		found[this.id] = this;
		fringe = [this];
		while (fringe.length > 0) {
			elt = fringe.pop();
			for (j = elt.ports.length - 1; j >= 0; j -= 1) {
				pj = elt.ports[j];
				if (pj.input === traverseInput) {
					for (k = pj.ports.length - 1; k >= 0; k -= 1) {
						ek = pj.ports[k].elt;
						if (!found.hasOwnProperty(ek.id)) {
							if (mapTo) {
								found[ek.id] = mapTo;
							} else {
								found[ek.id] = ek;
							}
							fringe.push(ek);
						}
					}
				}
			}
		}
		return found;
	};

	my.Element.prototype.findElementsForward = function (addTo, mapTo) {
		return this.findElements(false, addTo, mapTo);
	};

	my.Element.prototype.findElementsBackward = function (addTo, mapTo) {
		return this.findElements(true, addTo, mapTo);
	};

	my.Layout = function () {
		this.maxEltId = -1;
		this.maxPortId = -1;
		this.elts = [];
	};

	my.Layout.prototype.addElement = function (elt) {
		var id;

		id = this.maxEltId + 1;
		this.maxEltId = id;
		elt.id = id;

		id = this.maxPortId;
		$.each(elt.ports, function (i, port) {
			id += 1;
			port.id = id;
		});
		this.maxPortId = id;

		this.elts.push(elt);
	};

	my.Layout.prototype.removeElement = function (elt) {
		$.each(elt.ports, function (i, port) {
			var j;
			for (j = port.ports.length - 1; j >= 0; j -= 1) {
				removeArray(port.ports[j].ports, port);
			}
		});
		removeArray(this.elts, elt);
	};

	my.Layout.prototype.addWire = function (port0, port1) {
		if (port0.input === port1.input) {
			if (port0.input) {
				throw new Error('Cannot connect inputs');
			} else {
				throw new Error('Cannot connect outputs');
			}
		}
		if ($.inArray(port0.ports, port1) < 0) {
			port0.ports.push(port1);
		}
		if ($.inArray(port1.ports, port0) < 0) {
			port1.ports.push(port0);
		}
	};

	my.Layout.prototype.removeWire = function (port0, port1) {
		removeArray(port0.ports, port1);
		removeArray(port1.ports, port0);
	};

	my.Layout.prototype.forEachWire = function (callback) {
		var i, elt, j, pj, k, ret;
		for (i = this.elts.length - 1; i >= 0; i -= 1) {
			elt = this.elts[i];
			for (j = elt.ports.length - 1; j >= 0; j -= 1) {
				pj = elt.ports[j];
				if (pj.input) {
					for (k = pj.ports.length - 1; k >= 0; k -= 1) {
						ret = callback(pj, pj.ports[k]);
						if (ret === false) {
							return false;
						}
					}
				}
			}
		}
	};

	my.Layout.prototype.forEachPort = function (callback) {
		var i, elt, j, ret;
		for (i = this.elts.length - 1; i >= 0; i -= 1) {
			elt = this.elts[i];
			for (j = elt.ports.length - 1; j >= 0; j -= 1) {
				ret = callback(elt.ports[j]);
				if (ret === false) {
					return false;
				}
			}
		}
	};
}(Workshop, jQuery));
