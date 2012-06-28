var Filters = (function ($) {
	var my = {}

	my.find_connection = function (element, connectedTo, type) {
		if(type == 'input') {
			type = true
		} else if (type == 'output') {
			type = false
		}
		return element.connects.filter(function(connection) {
			return connection_is_match(connection, {input: type, connectedTo: connectedTo});
		})[0];
	}

	my.filter_elements = function(elements, criterion){ //both criterion and elements are arrays
		var remaining_elements = elements
		$.each(criterion, function(key, value){
			remaining_elements = remaining_elements.filter(function(element){
				//filter will match up each to the criteria to create a new remaining_elements with only things that match
				return is_match(element, key, value)
			});
		});
		return remaining_elements
	};

	var is_match = function(element, key, criteria){
		var i = 0;
		switch (key) {
			case 'type': return matches_key(criteria, element.type);
			case 'sensor': return matches_key(criteria, element.type);
			case 'connects':
				var valid_connections = element.connects.filter(function(connection) {return connection_is_match(connection, criteria)}) //feed in the entire hash of connection criteria
				if (valid_connections && valid_connections.length > 0) {return true} else {return false}
			default:
		}
	}

	var connection_is_match = function(connection, criteria){	//'this' is the criterion
		var this_is_a_match = true;
		$.each(criteria, function(connection_key, connection_value) {
			switch (connection_key) {
				case 'input':
					if(connection_value != connection.input){this_is_a_match = false}
					break;
				case 'connectedTo':
					var one_matches = false;
					these_connections = connection.connectedTo.split()
					$.each(these_connections, function(i, link){

						if (test_one_link(link, connection_value)){
							one_matches = true;
						}
					})
					if (!one_matches) {this_is_a_match = false}
					break;
			}
		});
		return this_is_a_match
	}

	var test_one_link = function(link, link_value){
		if (link_value == 'filled') {
			if (test_regex('[0-9]+', link)) {return true}
		} else if (link_value == 'empty') {
			if(test_regex(('^$', link))) {return true}
		} else {
			if(matches_key(link_value, link)){return true}
		}
		return false;
	}


	var test_regex = function(regex, string) {
		var re = new RegExp(regex)
		result = re.exec(string)
		if (result && result.length > 0){
			return true;
		} else {
			return false;
		}
	}
	var matches_key = function(find_this, find_in){
		var re = new RegExp(''+find_this)
		if (re.exec(find_in)) {return true;} else {return false}
	}

	return my;
}(jQuery))

var CircElements = (function () {
	var my = function (elements) {
		this.elements = elements;
	};

	my.prototype.exists = function () {
		return this.elements.length > 0;
	}

	my.prototype.empty = function () {
		return new my(Filters.filter_elements(this.elements, {connects: {connectedTo: 'empty'}}))
	}

	my.prototype.id = function (id) {
		return new my(Filters.filter_elements(this.elements, {id: id})[0])
	};

	my.prototype.all_connected_to = function (id) {
		return new my(Filters.filter_elements(this.elements, {connects: {connectedTo: id}}))
	};

	my.prototype.sensor = function (type) {
		var self, all_sensors, sensor_type, elements;
		self = this;
		if (type == null) {
			all_sensors = [];
			sensor_types = ['-', '^\\|$', '^o$', 'C', 'Y', 'R', 'G'];
			elements = this.elements;
			$.each(sensor_types, function (i, sensor) {
				var new_sensor_array = self.filter_one_sensor_type(elements, sensor);
				var new_sensor = new_sensor_array[0];
				if (new_sensor) {
					all_sensors.push(new_sensor);
				}
			});
			return new my(all_sensors);
		} else {
			return new my(Filters.filter_elements(this.elements, {type: type}));
		}
	};

	my.prototype.filter_one_sensor_type = function (elements, regex) {
		return Filters.filter_elements(elements, {type: regex})
	};

	my.prototype.output = function (connectedTo) {
		return new my(Filters.filter_elements(this.elements, {connects: {input: false, connectedTo: connectedTo}}))
	};

	my.prototype.input = function (connectedTo) {
		return new my(Filters.filter_elements(this.elements, {connects: {input: true, connectedTo: connectedTo}}))
	};

	my.prototype.active_connection = function () {
		return new my(Filters.filter_elements(this.elements, {connects: {connectedTo: 'active'}}))
	};

	my.prototype.lightbulb = function () {
		return new my(Filters.filter_elements(this.elements, {type: 'out'}))
	};

	my.prototype.OR = function () {
		return new my(Filters.filter_elements(this.elements, {type: 'or'}))
	};

	my.prototype.AND = function () {
		return new my(Filters.filter_elements(this.elements, {type: 'and'}))
	};

	my.prototype.NOT = function () {
		return new my(Filters.filter_elements(this.elements, {type: 'not'}))
	};

	my.prototype.first_connection = function () {
		if (this.elements && this.elements.length > 0) {
			return this.elements[0].connects[0];
		} else {
			return null;
		}
	};

	return my;
}());
