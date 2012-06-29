function setBubble(targets, levelId, textId, bubbleBase) {
	var locations;
	if (typeof targets === 'undefined') {
		Tutorial.setHighlights([]);
	} else {
		locations = [];
		$.each(targets, function (i, target) {
			console.log('target', target.x, target.y, target.r);
			locations.push({x: target.x - 1.5 * target.r, y: target.y - 1.5 * target.r,
				width: 3 * target.r, height: 3 * target.r,
				isCircular: true});
		});
		Tutorial.setHighlights(locations);
	}
	if (typeof levelId === 'undefined') {
		Tutorial.removeBubble();
	} else {
		Tutorial.setBubble(bubbleBase, levelId, textId);
	}
}

var tutorial_scripts = {
	'i_so_blue': function () {
		var elements = new CircElements(Circuit.getElements());
		var blueConnection = elements.sensor().first_connection();

		if (elements.sensor('C').output('empty').exists() &&
				elements.lightbulb().input('empty').exists()) {
			setBubble([blueConnection], 1, 1, blueConnection);
		} else if (elements.sensor('C').active_connection().exists() &&
						elements.lightbulb().input('empty').exists()) {
			//since lightbulbs only have one connection point, and it has been confirmed that it is empty, it is safe to go directly to it with first_connection
			var lightbulb_in = elements.lightbulb().first_connection();
			setBubble([lightbulb_in], 1, 2, blueConnection);
		} else if (elements.sensor('C').output('filled').exists() &&
						elements.lightbulb().input('filled').exists()) {
			// the user has connected the two
			setBubble([], 1, 3, blueConnection);
		} else {
			setBubble([]);
		}
	},

	'its_a_start': function () {
		var elements = new CircElements(Circuit.getElements());
		var lightbulb_in = elements.lightbulb().first_connection();
		var empty_sensors = elements.sensor().empty().elements;
		var bubbleBase = elements.sensor().first_connection();

		if (empty_sensors && empty_sensors.length == 3) {
			var targets = []
			$.each(empty_sensors, function (i, sensor) {
				targets.push(Filters.find_connection(sensor, 'empty', false));
			});
			setBubble(targets, 2, 1, bubbleBase);
		} else if (elements.sensor('\\|').active_connection().exists() &&
							elements.lightbulb().empty().exists()) {
			setBubble([lightbulb_in], 2, 2, bubbleBase);
		} else if (elements.sensor().active_connection().exists() &&
						 elements.lightbulb().empty().exists()) {
			setBubble([], 2, 3, bubbleBase);
		} else if (elements.lightbulb().input('filled').exists() &&
						elements.sensor('\\|').empty().exists()) {
			setBubble([], 2, 4, bubbleBase);
		} else {
			setBubble([]);
		}
	},

	'soyl_not_green': function () {
		var elements = new CircElements(Circuit.getElements());
		var bubbleBase = elements.sensor().first_connection();

		if (elements.lightbulb().input('filled').exists() && !elements.NOT().output('filled').exists()) {
			setBubble([elements.lightbulb().first_connection()], 3, 1, bubbleBase);
		} else if (!elements.NOT().exists()) {
			setBubble([], 3, 2, bubbleBase);
		} else if (elements.NOT() && elements.NOT().elements.length > 1) {
			setBubble([], 3, 3, bubbleBase);
		} else if (elements.NOT().input('empty').exists()) {
			//must find a way to capture the INPUT, not the OUTPUT
			var operator_input = Filters.find_connection(elements.NOT().elements[0], 'empty', 'input')//find_incoming(elements.NOT().input('empty'), 'empty');
			var sensor_output = Filters.find_connection(elements.sensor('G').elements[0], 'empty', 'output');
			setBubble([operator_input, sensor_output], 3, 4, bubbleBase);
		} else if (elements.NOT().input('filled').exists() &&
				(elements.NOT().output('empty').exists() || elements.lightbulb().input('empty').exists())) {
			//if the first part of the operator is filled in, but either the outgoing part of the NOT operator or the incoming part of the lightbulb is still empty
			var operator_output = Filters.find_connection(elements.NOT().output('empty').elements[0], 'empty', 'output');
			var lightbulb_input = elements.lightbulb().first_connection();
			setBubble([operator_output, lightbulb_input], 3, 5, bubbleBase);
		} else {
			setBubble([]);
		}
	},

	'flavor_unearthed': function () {
		var elements = new CircElements(Circuit.getElements());
		var empty_sensors = elements.sensor().output('empty').elements;
		var or_operators = elements.OR().elements;
		var bubbleBase = elements.sensor().first_connection();


		if (elements.lightbulb().input('filled').exists() && !elements.OR().output('filled').exists()) {
			setBubble([elements.lightbulb().first_connection()], 4, 1, bubbleBase);
		} else if (or_operators.length < 1) {
			setBubble([], 4, 2, bubbleBase);
		} else if (or_operators.length > 1) {
			setBubble([], 4, 3, bubbleBase);
		} else if (empty_sensors.length == 2 ||
				(empty_sensors.length == 1 && elements.sensor().active_connection().exists())) {
			var targets = [];
			$.each(or_operators[0].connects, function (i, connection) {
				if (connection.input) {
					targets.push(connection);
				}
			});
			setBubble(targets, 4, 4, bubbleBase);
		} else if ((empty_sensors && empty_sensors.length == 1) ||
				elements.sensor().active_connection().exists()) {
			// highlight the remaining outgoing sensor and incoming OR
			var targets = [];
			targets.push(empty_sensors[0].connects[0]); // may be active?
			targets.push(Filters.find_connection(or_operators[0], 'empty', true));
			setBubble(targets, 4, 5, bubbleBase);
		} else if (empty_sensors.length == 0) {
			setBubble([], 4, 6, bubbleBase);
		} else {
			setBubble([]);
		}
	},

	'anti_twinkle': function () {
		var elements = new CircElements(Circuit.getElements());

		if(elements.OR().exists() && elements.NOT().exists()) {
			//do nothing
		} else {
			setBubble([], 6, 1, elements.sensor().first_connection());
		}
	},

	'out_on_a_lemon': function () {
		var elements = new CircElements(Circuit.getElements());
		var empty_sensors = elements.sensor().output('empty').elements;
		var and_operators = elements.AND().elements;
		var bubbleBase = elements.sensor().first_connection();


		if (elements.lightbulb().input('filled').exists() && !elements.AND().output('filled').exists()) {
			setBubble([elements.lightbulb().first_connection()], 8, 1, bubbleBase);
		} else if (and_operators.length < 1) {
			setBubble([], 8, 2, bubbleBase);
		} else if (and_operators.length > 1) {
			setBubble([], 8, 3, bubbleBase);
		} else if (empty_sensors.length == 2 ||
				(empty_sensors.length == 1 && elements.sensor().active_connection().exists())) {
			var targets = [];
			$.each(and_operators[0].connects, function (i, connection) {
				if (connection.input) {
					targets.push(connection);
				}
			});
			setBubble(targets, 8, 4, bubbleBase);
		} else if ((empty_sensors && empty_sensors.length == 1) ||
				elements.sensor().active_connection().exists()) {
			//highlight the remaining outgoing sensor and incoming AND
			var targets = [];
			targets.push(empty_sensors[0].connects[0]); // may be active?
			targets.push(Filters.find_connection(and_operators[0], '', true));
			setBubble(targets, 8, 5, bubbleBase);
		} else if (empty_sensors.length == 0) {
			setBubble([], 8, 6, bubbleBase);
		} else {
			setBubble([]);
		}
	}
};
