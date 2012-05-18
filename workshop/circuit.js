var Circuit = (function ($) {
	"use strict";

	var my = {};
	var workshop = null;

	$(document).ready(function () {
		var main;

		main = $('#circuit');
		if (!main.hasClass('circ-container')) {
			workshop = new Workshop.Workshop(main);
			workshop.setTools(['and', 'or', 'not', 'in', 'out']);
			if (typeof Tutorial !== 'undefined' && Tutorial.circuitChanged) {
				workshop.addChangeListener(function () {
						Tutorial.circuitChanged();
				});
			}
		}
	});

	function EvaluatorAdapter(layout) {
		var acceptConn;
		acceptConn = null;
		$.each(layout.elts, function (i, elt) {
			if (elt.type.id === 'out') {
				acceptConn = elt.conns[0];
				return false;
			}
		});

		this.evaluator = evaluator;
		this.acceptConn = acceptConn;
	}

	EvaluatorAdapter.prototype.evaluate = function (item) {
		var state;
		state = this.evaluator.evaluate();
		state.accept = state.getValue(this.acceptConn);
	};

	my.getEvaluator = function () {
		return new EvaluatorAdapter(workshop.layout);
	};

	my.setState = function (state) {
		workshop.setState(state);
	};

	my.getElements = function () {
		var ret, wiringConn;
		ret = [];
		if (!workshop || !workshop.layout) {
			return ret;
		}
		wiringConn = workshop.gesture.conn0 || null;
		$.each(layout.elts, function (i, elt) {
			var conns, conn, toStr, j, k;
			conns = [];
			for (j = 0; j < elt.conns.length; j += 1) {
				conn = elt.conns[j];
				if (conn === wiringConn) {
					toStr = 'active';
				} else {
					toStr = '';
				}
				for (k = 0; k < conn.conns.length; k += 1) {
					if (toStr === '') {
						toStr += conn.conns[k].elt.id;
					} else {
						toStr += ' ' + conn.conns[k].elt.id;
					}
				}
				conns.push({input: conn.input, connectedTo: toStr,
					x: elt.x + conn.x, y: elt.y + conn.y, r: 15});
			}
			ret.push({id: elt.id, type: elt.type.id, connects: conns});
		});
		return ret;
	};

	my.levelChanged = function (oldLevel, newLevel) {
	};

	return my;
}(jQuery));
