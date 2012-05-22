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
//    if (type == null) {
//      type = 'sensor'
//    }
    return new Elements(Filters.filter_elements(this.elements, {type: type}))
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
    return new Elements(Filters.filter_elements(this.elements, {type: 'OR'}))
  }

  this.AND = function(){
    return new Elements(Filters.filter_elements(this.elements, {type: 'AND'}))
  }

  this.NOT = function(){
    return new Elements(Filters.filter_elements(this.elements, {type: 'NOT'}))
  }

  this.first_connection = function(){
    return this.elements[0].connects[0]
  }

  return this

}