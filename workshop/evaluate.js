(function (my, $) {
	"use strict";
	function getValue(conn, trues) {
		if (conn.input) {
			if (conn.conns.length === 0) {
				return false;
			} else {
				return trues.hasOwnProperty(conn.conns[0].id);
			}
		} else {
			return trues.hasOwnProperty(conn.id);
		}
	}

	my.Evaluator = function (layout) {
		this.layout = layout;
		this.trues = {}; // set of connection ids with true values
		this.eltStates = {};
	};

	my.Evaluator.prototype.evaluate = function () {
		var trues, eltStates, state, dirty, iters, anyDirty, id, conns, i, j, set;

		trues = {};
		$.each(this.trues, function (key, val) {
			trues[key] = val;
		});
		eltStates = {};
		$.each(this.eltStates, function (key, val) {
			eltStates[key] = val;
		});
		state = new my.State(this.layout, trues, eltStates);
		dirty = {};
		$.each(this.layout.elts, function (i, elt) {
			dirty[elt.id] = elt;
		});
		for (iters = 0; iters < 50; iters += 1) {
			anyDirty = false;
			state.sets = [];
			for (id in dirty) {
				if (dirty.hasOwnProperty(id)) {
					anyDirty = true;
					dirty[id].propagate(state);
				}
			}
			if (!anyDirty) {
				break;
			}
			dirty = {};
			for (i = 0; i < state.sets.length; i += 1) {
				set = state.sets[i];
				if (getValue(set.conn, trues) !== set.val) {
					state.repaintConns[set.conn.id] = set.conn;
					if (set.val) {
						trues[set.conn.id] = 1;
					} else {
						delete trues[set.conn.id];
					}

					conns = set.conn.conns;
					for (j = 0; j < conns.length; j += 1) {
						dirty[conns[j].elt.id] = conns[j].elt;
					}
				}
			}
		}
		this.trues = trues;
		this.eltStates = eltStates;
		return state;
	};

	my.State = function (layout, trues, eltStates) {
		var accept;

		accept = false;
		$.each(layout.elts, function (i, elt) {
			if (elt.type.id === 'out') {
				accept = getValue(elt.conns[0], trues);
			}
		});

		this.layout = layout;
		this.trues = trues;
		this.eltStates = eltStates;
		this.accept = accept;
		this.sets = [];
		this.repaintConns = {};
	};

	my.State.prototype.getValue = function (conn) {
		return getValue(conn, this.trues);
	};

	my.State.prototype.setValue = function (conn, val) {
		if (conn.input) {
			throw new Error('Cannot set value for input');
		} else {
			this.sets.push({conn: conn, val: val});
		}
	};
}(Workshop, jQuery));
