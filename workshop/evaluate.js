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

	function copyShallow(obj) {
		var ret, key;
		ret = {};
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				ret[key] = obj[key];
			}
		}
		return ret;
	}

	function State (previous, layout, trues, eltStates) {
		this.previous = previous;
		this.layout = layout;
		this.trues = trues;
		this.eltStates = eltStates;
		this.repaintConns = {};
		this.repaintElts = {};
	};

	function isFrozen(state) {
		return typeof state.sets === 'undefined';
	}

	function setFrozen(state, value) {
		if (value) {
			if (typeof state.sets !== 'undefined') {
				delete state.sets;
			}
		} else {
			state.sets = [];
		}
	}

	State.prototype.getState = function (elt) {
		return this.eltStates[elt.id];
	};

	State.prototype.getValue = function (conn) {
		return getValue(conn, this.trues);
	};

	State.prototype.setState = function (elt, value) {
		if (isFrozen(this)) {
			var newStates;
			newStates = copyShallow(this.eltStates);
			newStates[elt.id] = value;
			return new State(this, this.layout, this.trues, newStates);
		} else {
			this.eltStates[elt.id] = value;
			this.repaintElts[elt.id] = elt;
		}
	};

	State.prototype.setValue = function (conn, val) {
		if (isFrozen(this)) {
			throw new Error('state is frozen');
		} else if (conn.input) {
			throw new Error('Cannot set value for input');
		} else {
			this.sets.push({conn: conn, val: val});
		}
	};

	State.prototype.follows = function (state) {
		return this.previous === state;
	}

	State.prototype.evaluate = function () {
		var trues, eltStates, state, dirty, iters, anyDirty, id, conns, i, j, set;

		trues = copyShallow(this.trues);
		eltStates = copyShallow(this.eltStates);
		state = new State(this, this.layout, trues, eltStates);
		setFrozen(state, false);
		dirty = {};
		for (i = this.layout.elts.length - 1; i >= 0; i -= 1) {
			dirty[this.layout.elts[i].id] = this.layout.elts[i];
		}
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
		setFrozen(state, true);
		return state;
	};

	my.newInitialState = function (layout) {
		return new State(null, layout, {}, {}).evaluate();
	}
}(Workshop, jQuery));
