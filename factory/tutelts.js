var CircElements = (function () {
	var my = function (elements) {
		this.elements = elements;
	};

	my.prototype.exists = function () {
		return this.elements.length > 0;
	};

	my.prototype.empty = function () {
		return new my(Filters.filter_elements(this.elements, {connects: {connectedTo: 'empty'}}));
	};

	my.prototype.id = function (id) {
		return new my(Filters.filter_elements(this.elements, {id: id})[0]);
	};

	my.prototype.all_connected_to = function (id) {
		return new my(Filters.filter_elements(this.elements, {connects: {connectedTo: id}}));
	};

	my.prototype.sensor = function (type) {
		var self, all_sensors, sensor_type, elements;
		self = this;
		if (type === null) {
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
		return Filters.filter_elements(elements, {type: regex});
	};

	my.prototype.output = function (connectedTo) {
		return new my(Filters.filter_elements(this.elements, {connects: {input: false, connectedTo: connectedTo}}));
	};

	my.prototype.input = function (connectedTo) {
		return new my(Filters.filter_elements(this.elements, {connects: {input: true, connectedTo: connectedTo}}));
	};

	my.prototype.active_connection = function () {
		return new my(Filters.filter_elements(this.elements, {connects: {connectedTo: 'active'}}));
	};

	my.prototype.lightbulb = function () {
		return new my(Filters.filter_elements(this.elements, {type: 'out'}));
	};

	my.prototype.OR = function () {
		return new my(Filters.filter_elements(this.elements, {type: 'or'}));
	};

	my.prototype.AND = function () {
		return new my(Filters.filter_elements(this.elements, {type: 'and'}));
	};

	my.prototype.NOT = function () {
		return new my(Filters.filter_elements(this.elements, {type: 'not'}));
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
