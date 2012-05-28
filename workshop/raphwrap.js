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

	function CanvasElt() { }

	CanvasElt.prototype.attr = function (key, val) {
		var curVal;

		curVal = this.attrs[key];
		if (curVal !== val) {
			this.attrs[key] = val;
			this.wrap.dirty = true;
		}
	};

	CanvasElt.prototype.show = function () {
		this.attr('shown', false);
	};

	CanvasElt.prototype.show = function () {
		this.attr('shown', true);
	};

	CanvasElt.prototype.remove = function () {
		var elts, i;
		elts = this.wrap.canvasElts;
		for (i = elts.length; i >= 0; i -= 1) {
			if (elts[i] === this) {
				elts.splice(i, 1);
			}
		}
		this.wrap.dirty = true;
	}

	function CanvasPath(wrap, points, attrs) {
		this.wrap = wrap;
		this.points = points;
		this.attrs = attrs;
		this.shown = true;
	}

	CanvasPath.prototype = new CanvasElt();

	CanvasPath.prototype.paint = function (ctx) {
		var pts, i;
		
		pts = this.points;
		ctx.beginPath();
		ctx.moveTo(pts[0][0], pts[0][1]);
		for (i = 1; i < pts.length; i += 1) {
			ctx.lineTo(pts[i][0], pts[i][1]);
		}
		ctx.stroke();
	}

	RaphWrap = function (elt, width, height) {
		var hasSvg, jqElt, canvas;
		hasSvg = Raphael && (window.SVGAngle ||
			document.implementation.hasFeature(SVGxml, "1.1"));
		// hasSvg = false;
		if (hasSvg) {
			this.paper = Raphael(elt, width, height);
		} else {
			canvas = $('<canvas></canvas>').css('width', width)
				.css('height', height);
			if (canvas.get(0).getContext) {
				console.log('using canvas');
				this.paper = null;
				this.canvas = canvas;
				this.canvasElts = [];
				$(elt).append(canvas);
			} else {
				console.log('rejecting canvas');
				this.paper = Raphael(elt, width, height);
			}
		}
		this.dirty = false;
	}

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
			circ = new CanvasPath(this, [[x, y], [x + r, y]], attrs);
			this.canvasElts.push(circ);
			this.dirty = true;
			return circ;
		}
	};

	RaphWrap.prototype.setSize = function (width, height) {
		var paper;

		paper = this.paper;
		if (paper) {
			paper.setSize(width, height);
		} else {
			this.canvas.width(width).height(height);
			this.dirty = true;
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

	RaphWrap.prototype.repaintAfter = function (callback) {
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
				if (elts[i].shown) {
					elts[i].paint(context);
				}
			}
		}
	};

	return function (jqElt, width, height) {
		return new RaphWrap(jqElt, width, height);
	}
}(Raphael || {}, jQuery));
