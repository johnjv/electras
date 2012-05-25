var Elements = function(elements){
  this.elements = elements

  this.exists = function(){
    return this.elements.length > 0;
  }

  this.empty = function(){
    return new Elements(Filters.filter_elements(this.elements, {connects: {connectedTo: 'empty'}}))
  }

  this.id = function(id){
    return new Elements(Filters.filter_elements(this.elements, {id: id})[0])
  }

  this.all_connected_to = function(id){
    return new Elements(Filters.filter_elements(this.elements, {connects: {connectedTo: id}}))
  }

  this.sensor = function(type){
    if (type == null) {
      var all_sensors = []
      var sensor_types = ['-', '^\\|$', '^o$', 'C', 'Y', 'R', 'G']
      var elements = this.elements
      $.each(sensor_types, function(i, sensor){
        var new_sensor_array = filter_one_sensor_type(elements, sensor);
        var new_sensor = new_sensor_array[0]
        if (new_sensor){
          all_sensors.push(new_sensor)
        }
      })
      return new Elements(all_sensors)
    } else {
      return new Elements(Filters.filter_elements(this.elements, {type: type}))
    }
  }

  var filter_one_sensor_type = function(elements, regex) {
    return Filters.filter_elements(elements, {type: regex})
  }

  this.output = function(connectedTo){
    return new Elements(Filters.filter_elements(this.elements, {connects: {input: false, connectedTo: connectedTo}}))
  }

  this.input = function(connectedTo){
    return new Elements(Filters.filter_elements(this.elements, {connects: {input: true, connectedTo: connectedTo}}))
  }

  this.active_connection = function(){
    return new Elements(Filters.filter_elements(this.elements, {connects: {connectedTo: 'active'}}))
  }

  this.lightbulb = function(){
    return new Elements(Filters.filter_elements(this.elements, {type: 'out'}))
  }

  this.OR = function(){
    return new Elements(Filters.filter_elements(this.elements, {type: 'or'}))
  }

  this.AND = function(){
    return new Elements(Filters.filter_elements(this.elements, {type: 'and'}))
  }

  this.NOT = function(){
    return new Elements(Filters.filter_elements(this.elements, {type: 'not'}))
  }

  this.first_connection = function(){
    return this.elements[0].connects[0]
  }

  return this

}
