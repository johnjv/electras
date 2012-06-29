var CircElements = (function ($) {
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
		if (typeof type === 'undefined' || type === null) {
			return new my(Filters.filterByType(this.elements, '[-|oCYRG]'));
		} else {
			return new my(Filters.filterByType(this.elements, type));
		}
	};

	my.prototype.filter_one_sensor_type = function (elements, regex) {
		return Filters.filterByType(elements, regex);
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
		return new my(Filters.filterByType(this.elements, 'out'));
	};

	my.prototype.OR = function () {
		return new my(Filters.filterByType(this.elements, 'or'));
	};

	my.prototype.AND = function () {
		return new my(Filters.filterByType(this.elements, 'and'));
	};

	my.prototype.NOT = function () {
		return new my(Filters.filterByType(this.elements, 'not'));
	};

	my.prototype.first_connection = function () {
		if (this.elements && this.elements.length > 0) {
			return this.elements[0].connects[0];
		} else {
			return null;
		}
	};

	return my;
}(jQuery));
