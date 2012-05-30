if (typeof Raphael === 'undefined') {
	Raphael = false;
}

var raphwrap = (function (Raphael, $) {
	"use strict";

	var RaphWrap, SVGxml;

	SVGxml = "http://www.w3.org/TR/SVG11/feature#BasicStructure";

	function setAttrs(elt, attrs) {
		var key, k;
		for (key in attrs) {
			if (attrs.hasOwnProperty(key)) {
				if (key === 'strokeWidth') {
					k = 'stroke-width';
				} else {
					k = key;
				}
				elt.attr(k, attrs[key]);
			}
		}
		return elt;
	}

	var KNOWN_ATTRS = { stroke: 'strokeStyle', fill: 'fillStyle',
		strokeWidth: 'lineWidth', opacity: 'globalAlpha' };

	function CanvasElt() { }

	CanvasElt.prototype.init = function (wrap, attrs) {
		var self, key;
		this.wrap = wrap;
		this.attrs = attrs;
		this.shown = true;
		self = this;
		for (key in attrs) {
			if (attrs.hasOwnProperty(key)) {
				if (KNOWN_ATTRS.hasOwnProperty(key)) {
					self[key] = attrs[key];
				} else {
					console.log('Unknown attribute "' + key + '"'); //OK
				}
			}
		}
	};

	CanvasElt.prototype.attr = function (key, val) {
		var curVal;

		if (KNOWN_ATTRS.hasOwnProperty(key)) {
			curVal = this[key];
			if (curVal !== val) {
				this[key] = val;
				this.wrap.dirty = true;
			}
		} else {
			console.log('Unknown attribute "' + key + '"'); //OK
		}
	};

	CanvasElt.prototype.show = function () {
		if (!this.shown) {
			this.shown = true;
			this.wrap.dirty = true;
		}
	};

	CanvasElt.prototype.hide = function () {
		if (this.shown) {
			this.shown = false;
			this.wrap.dirty = true;
		}
	};

	CanvasElt.prototype.remove = function () {
		var elts, i, found;
		elts = this.wrap.canvasElts;
		found = false;
		for (i = elts.length; i >= 0; i -= 1) {
			if (elts[i] === this) {
				elts.splice(i, 1);
				found = true;
			}
		}
		if (found) {
			this.wrap.dirty = true;
		}
	};

	CanvasElt.prototype.paint = function (ctx) {
		var key;
		if (this.shown) {
			ctx.save();
			for (key in KNOWN_ATTRS) {
				if (KNOWN_ATTRS.hasOwnProperty(key) &&
						this.hasOwnProperty(key)) {
					ctx[KNOWN_ATTRS[key]] = this[key];
				}
			}
			if (this.fill) {
				ctx.beginPath();
				this.tracePath(ctx);
				ctx.fill();
			}
			if (!this.fill || this.stroke) {
				ctx.beginPath();
				this.tracePath(ctx);
				ctx.stroke();
			}
			ctx.restore();
		}
	};

	function CanvasPath(wrap, points, attrs) {
		this.init(wrap, attrs);
		this.points = points;
	}

	CanvasPath.prototype = new CanvasElt();

	CanvasPath.prototype.tracePath = function (ctx) {
		var pts, i;
		pts = this.points;
		ctx.moveTo(pts[0][0], pts[0][1]);
		for (i = 1; i < pts.length; i += 1) {
			ctx.lineTo(pts[i][0], pts[i][1]);
		}
	};

	function CanvasCircle(wrap, x, y, r, attrs) {
		this.init(wrap, attrs);
		this.x = x;
		this.y = y;
		this.r = r;
	}

	CanvasCircle.prototype = new CanvasElt();

	CanvasCircle.prototype.tracePath = function (ctx) {
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
	};

	RaphWrap = function (elt, width, height) {
		var hasSvg, canvas;
		hasSvg = Raphael && (window.SVGAngle ||
			document.implementation.hasFeature(SVGxml, "1.1"));
		if (hasSvg) {
			this.paper = Raphael(elt, width, height);
		} else {
			canvas = $('<canvas></canvas>').css('width', width)
				.css('height', height);
			if (canvas.get(0).getContext) {
				this.paper = null;
				this.canvas = canvas;
				this.canvasElts = [];
				$(elt).append(canvas);
			} else {
				this.paper = Raphael(elt, width, height);
			}
		}
		this.dirty = false;
	};

	RaphWrap.prototype.path = function (points, attrs) {
		var paper, path, i;

		paper = this.paper;
		if (paper) {
			path = 'M' + points[0][0] + ',' + points[0][1];
			for (i = 1; i < points.length; i += 1) {
				path += 'L' + points[i][0] + ',' + points[i][1];
			}
			return setAttrs(paper.path(path), attrs);
		} else {
			path = new CanvasPath(this, points, attrs);
			this.canvasElts.push(path);
			this.dirty = true;
			return path;
		}
	};

	RaphWrap.prototype.circle = function (x, y, r, attrs) {
		var paper, circ;

		paper = this.paper;
		if (paper) {
			return setAttrs(paper.circle(x, y, r), attrs);
		} else {
			circ = new CanvasCircle(this, x, y, r, attrs);
			this.canvasElts.push(circ);
			this.dirty = true;
			return circ;
		}
	};

	RaphWrap.prototype.setSize = function (width, height) {
		var paper, canvas;

		paper = this.paper;
		if (paper) {
			paper.setSize(width, height);
		} else {
			canvas = this.canvas;
			if (canvas) {
				canvas.width(width).height(height);
				canvas.get(0).setAttribute('width', width);
				canvas.get(0).setAttribute('height', height);
				this.dirty = true;
			}
		}
	};

	RaphWrap.prototype.clear = function () {
		var paper, elts;
		paper = this.paper;
		if (paper) {
			paper.clear();
		} else {
			elts = this.canvasElts;
			if (elts.length > 0) {
				this.canvasElts = [];
				this.dirty = true;
			}
		}
	};

	RaphWrap.prototype.paintAfter = function (callback) {
		var canvas, context, elts, numElts, i;

		if (callback) {
			callback();
		}
		canvas = this.canvas;
		if (canvas && this.dirty) {
			this.dirty = false;
			context = canvas.get(0).getContext('2d');
			context.clearRect(0, 0, canvas.width(), canvas.height());
			elts = this.canvasElts;
			numElts = elts.length;
			for (i = 0; i < numElts; i += 1) {
				elts[i].paint(context);
			}
		}
	};

	return function (jqElt, width, height) {
		return new RaphWrap(jqElt, width, height);
	};
}(Raphael || {}, jQuery));
