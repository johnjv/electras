(function (my, $) {
	"use strict";
	function getValue(port, trues) {
		if (port.input) {
			if (port.ports.length === 0) {
				return false;
			} else {
				return trues.hasOwnProperty(port.ports[0].id);
			}
		} else {
			return trues.hasOwnProperty(port.id);
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

	function State(previous, layout, trues, eltStates) {
		this.previous = previous;
		this.layout = layout;
		this.trues = trues;
		this.eltStates = eltStates;
		this.repaintPorts = {};
		this.repaintElts = {};
	}

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

	State.prototype.getValue = function (port) {
		return getValue(port, this.trues);
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
			return this;
		}
	};

	State.prototype.setValue = function (port, val) {
		if (isFrozen(this)) {
			throw new Error('state is frozen');
		} else if (port.input) {
			throw new Error('Cannot set value for input');
		} else {
			this.sets.push({port: port, val: val});
		}
	};

	State.prototype.follows = function (state) {
		return this.previous === state;
	};

	State.prototype.evaluate = function () {
		var trues, eltStates, state, dirty, iters, anyDirty, id, ports, i, j, set;

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
				if (getValue(set.port, trues) !== set.val) {
					state.repaintPorts[set.port.id] = set.port;
					if (set.val) {
						trues[set.port.id] = 1;
					} else {
						delete trues[set.port.id];
					}

					ports = set.port.ports;
					for (j = 0; j < ports.length; j += 1) {
						dirty[ports[j].elt.id] = ports[j].elt;
					}
				}
			}
		}
		setFrozen(state, true);
		return state;
	};

	my.newInitialState = function (layout) {
		return new State(null, layout, {}, {}).evaluate();
	};
}(Workshop, jQuery));
