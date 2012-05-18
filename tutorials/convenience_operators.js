var exists = function(elements){
  return elements.length > 0;
}

var lightbulb = function(elements){
  return Filters.filter_elements(elements, {type: 'lightbulb'})
}

var sensor = function(type, elements){
  return Filters.filter_elements(elements, {type: type})
}

var OR = function(elements){
  return Filters.filter_elements(elements, {type: 'OR'})
}

var AND = function(elements){
  return Filters.filter_elements(elements, {type: 'AND'})
}

var NOT = function(elements){
  return Filters.filter_elements(elements, {type: 'NOT'})
}

var all_connected_to = function(id, elements){
  return Filters.filter_elements(elements, {connections: {connected_to: id}})
}

var empty_input = function(elements){
  return Filters.filter_elements(elements, {connection_criteria: {type: 'incoming', connected_to: 'empty'}})
}

var empty_output = function(elements){
  return Filters.filter_elements(elements, {connection_criteria: {type: 'outgoing', connected_to: 'empty'}})
}

var active_connection = function(elements){
  return Filters.filter_elements(elements, {connection_criteria: {connected_to: 'active'}})
}

var filled_input = function(elements){
  return Filters.filter_elements(elements, {connection_criteria: {type: 'incoming', connected_to: 'any'}})
}

var filled_output = function(elements){
  return Filters.filter_elements(elements, {connection_criteria: {type: 'outgoing', connected_to: 'any'}})
}
var id = function(id, elements){
  return Filters.filter_elements(elements, {id: id})[0]
}


var Elements = function(elements){
  this.elements = elements

  this.exists = function(){
    return this.elements.length > 0;
  }

  this.sensor = function(type){
    return new Elements(Filters.filter_elements(this.elements, {type: type}))
  }

  this.empty_output = function(){
    return new Elements(Filters.filter_elements(this.elements, {connection_criteria: {type: 'outgoing', connected_to: 'empty'}}))
  }

  this.lightbulb = function(){
    return new Elements(Filters.filter_elements(this.elements, {type: 'lightbulb'}))
  }

  return this

}

find_incoming = function(element, status){
  console.log(element, status)
  return Filters.find_connection(element, status, 'incoming')
}
find_outgoing = function(Elements, status){
  element = Elements.elements[0]
  console.log(element, status)
  return Filters.find_connection(element, status, 'outgoing');
}
