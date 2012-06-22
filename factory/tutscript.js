var tutorial_scripts = {
	'i_so_blue': function () {
		var elements = new CircElements(Circuit.getElements())
		var blue_sensor_connection = elements.sensor().first_connection()

		if (elements.sensor('C').output('empty').exists() &&
				elements.lightbulb().input('empty').exists()){
			highlightSection(blue_sensor_connection, true)
			createSpeechBubble(blue_sensor_connection, 1, 1)
		}

		else if (elements.sensor('C').active_connection().exists() &&
						elements.lightbulb().input('empty').exists()){
			//since lightbulbs only have one connection point, and it has been confirmed that it is empty, it is safe to go directly to it with first_connection
			var lightbulb_in = elements.lightbulb().first_connection()
			highlightSection(lightbulb_in, true);
			createSpeechBubble(blue_sensor_connection, 1, 2);
		}

		else if (elements.sensor('C').output('filled').exists() &&
						elements.lightbulb().input('filled').exists()){
			console.log("the user has connected the two");
			Tutorial.unhighlightSection()
			createSpeechBubble(blue_sensor_connection, 1, 3);

		}

		else {
			 Tutorial.unhighlightSection()
		}
	},

	'its_a_start': function () {
		var elements = new CircElements(Circuit.getElements())
		var lightbulb_in = elements.lightbulb().first_connection()
		var empty_sensors = elements.sensor().empty().elements
		var first_sensor = elements.sensor().first_connection()

		if (empty_sensors && empty_sensors.length == 3) {
			var params = []
			$.each(empty_sensors, function(i, sensor){
					var highlighted_thing = Filters.find_connection(sensor,'empty',false)
					var parametric_thing = parametric_to_square(highlighted_thing, true)
					params.push(parametric_thing)
			})
			highlightSections(params)
			createSpeechBubble(first_sensor, 2, 1);
		}

		else if (elements.sensor('\\|').active_connection().exists() &&
							elements.lightbulb().empty().exists()) {
			highlightSection(lightbulb_in, true);
			createSpeechBubble(first_sensor, 2, 2);
		}

		else if (elements.sensor().active_connection().exists() &&
						 elements.lightbulb().empty().exists()){
			Tutorial.unhighlightSection()
			createSpeechBubble(first_sensor, 2, 3);
		}

		else if (elements.lightbulb().input('filled').exists() &&
						elements.sensor('\\|').empty().exists()) {
			Tutorial.unhighlightSection()
			createSpeechBubble(first_sensor, 2, 4);
		}

		else {
			Tutorial.unhighlightSection()
		}
	},

	'soyl_not_green': function () {
		var elements = new CircElements(Circuit.getElements());
		var first_sensor = elements.sensor().first_connection();

		if (elements.lightbulb().input('filled').exists() && !elements.NOT().output('filled').exists()){
			highlightSection(elements.lightbulb().first_connection(),	true)
			createSpeechBubble(first_sensor, 3, 1)
		}

		else if (!elements.NOT().exists()){
			Tutorial.unhighlightSection()
			createSpeechBubble(first_sensor, 3, 2)
		}

		else if (elements.NOT() && elements.NOT().elements.length > 1){
			Tutorial.unhighlightSection()
			createSpeechBubble(first_sensor, 3, 3)
		}

		else if (elements.NOT().input('empty').exists()){
			//must find a way to capture the INPUT, not the OUTPUT
			var operator_input = Filters.find_connection(elements.NOT().elements[0], 'empty', 'input')//find_incoming(elements.NOT().input('empty'), 'empty')
			var sensor_output = Filters.find_connection(elements.sensor('G').elements[0], 'empty', 'output')
			highlightSections([parametric_to_square(operator_input, true), parametric_to_square(sensor_output, true)])
	//		highlightSection(operator_input, true)
	//		highlightSection(sensor_output, true)
			createSpeechBubble(first_sensor, 3, 4) ;
		}

		else if (elements.NOT().input('filled').exists() &&
				(elements.NOT().output('empty').exists() || elements.lightbulb().input('empty').exists())) {
			//if the first part of the operator is filled in, but either the outgoing part of the NOT operator or the incoming part of the lightbulb is still empty
			var operator_output = Filters.find_connection(elements.NOT().output('empty').elements[0], 'empty', 'output')
			var lightbulb_input = elements.lightbulb().first_connection()
			highlightSections([parametric_to_square(operator_output, true), parametric_to_square(lightbulb_input, true)])
	//		highlightSection(operator_output, true)
	//		highlightSection(lightbulb_input, true)
			createSpeechBubble(first_sensor, 3, 5)
		}

		else {
			Tutorial.unhighlightSection()
		}
	},

	'flavor_unearthed': function () {
		var elements = new CircElements(Circuit.getElements())
		var empty_sensors = elements.sensor().output('empty').elements
		var or_operators = elements.OR().elements
		var first_sensor = elements.sensor().first_connection();


		if (elements.lightbulb().input('filled').exists() && !elements.OR().output('filled').exists()){
			highlightSection(elements.lightbulb().first_connection(),	true)
			createSpeechBubble(first_sensor, 4, 1)
		}

		else if (or_operators.length < 1){
			Tutorial.unhighlightSection()
			createSpeechBubble(first_sensor, 4, 2)
		}

		else if (or_operators.length > 1){
			Tutorial.unhighlightSection()
			createSpeechBubble(first_sensor, 4, 3)
		}

		else if (empty_sensors.length == 2 || (empty_sensors.length == 1 && elements.sensor().active_connection().exists())){
			var operator = or_operators[0]
			$.each(operator.connects,function(i, connection){
				if (connection.input){
					input = connection
					highlightSection(connection, true)
				}
			})
			createSpeechBubble(first_sensor, 4, 4) ;
		}

		else if ((empty_sensors && empty_sensors.length == 1) || elements.sensor().active_connection().exists()) {
	//		highlight the remaining outgoing sensor and incoming OR
			try {highlightSection(empty_sensors[0].connects[0], true)} catch(e){} //try because it might be active
			highlightSection(Filters.find_connection(or_operators[0], 'empty', true), true)
			createSpeechBubble(first_sensor, 4, 5)
		}

		else if (empty_sensors.length == 0){
			Tutorial.unhighlightSection()
			createSpeechBubble(first_sensor, 4, 6)
		}

		else {
			Tutorial.unhighlightSection()
		}
	},

	'anti_twinkle': function () {
		var elements = new CircElements(Circuit.getElements())

		if(elements.OR().exists() && elements.NOT().exists()){
			//do nothing
		} else {
			Tutorial.unhighlightSection()
			createSpeechBubble(elements.sensor().first_connection(), 6, 1)
		}
	},

	'out_on_a_lemon': function () {
		var elements = new CircElements(Circuit.getElements())
		var empty_sensors = elements.sensor().output('empty').elements
		var and_operators = elements.AND().elements
		var first_sensor = elements.sensor().first_connection();


		if (elements.lightbulb().input('filled').exists() && !elements.AND().output('filled').exists()){
			highlightSection(elements.lightbulb().first_connection(),	true)
			createSpeechBubble(first_sensor, 8, 1)
		}

		else if (and_operators.length < 1){
			Tutorial.unhighlightSection()
			createSpeechBubble(first_sensor, 8, 2)
		}

		else if (and_operators.length > 1){
			Tutorial.unhighlightSection()
			createSpeechBubble(first_sensor, 8, 3)
		}

		else if (empty_sensors.length == 2 || (empty_sensors.length == 1 && elements.sensor().active_connection().exists())){
			var operator = and_operators[0]
			$.each(operator.connects,function(i, connection){
				if (connection.input){
					input = connection
					highlightSection(connection, true)
				}
			})
			createSpeechBubble(first_sensor, 8, 4);
		}

		else if ((empty_sensors && empty_sensors.length == 1) || elements.sensor().active_connection().exists()) {
			//highlight the remaining outgoing sensor and incoming AND
			try {highlightSection(empty_sensors[0].connects[0], true)} catch(e){} //try because it might be active
			highlightSection(Filters.find_connection(and_operators[0], '', true), true)
			createSpeechBubble(first_sensor, 8, 5)
		}

		else if (empty_sensors.length == 0){
			Tutorial.unhighlightSection()
			createSpeechBubble(first_sensor, 8, 6)
		}

		else {
			Tutorial.unhighlightSection()
		}
	}
};
