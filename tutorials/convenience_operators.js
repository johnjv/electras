var Elements = function(elements){
  this.elements = elements

  this.exists = function(){
    return this.elements.length > 0;
  }

  this.empty = function(){
    return new Elements(Filters.filter_elements(this.elements, {connection_criteria: {connected_to: 'empty'}}))
  }

  this.id = function(id){
    return new Elements(Filters.filter_elements(this.elements, {id: id})[0])
  }

  this.all_connected_to = function(id){
    return new Elements(Filters.filter_elements(this.elements, {connection_criteria: {connected_to: id}}))
  }

  this.sensor = function(type){
    console.log('testing sensor', type)
    if (type == null) {
      type = 'sensor'
    }
    return new Elements(Filters.filter_elements(this.elements, {type: type}))
  }

  this.output = function(connected_to){
    return new Elements(Filters.filter_elements(this.elements, {connection_criteria: {type: 'outgoing', connected_to: connected_to}}))
  }

  this.input = function(connected_to){
    return new Elements(Filters.filter_elements(this.elements, {connection_criteria: {type: 'incoming', connected_to: connected_to}}))
  }

  this.active_connection = function(){
    return new Elements(Filters.filter_elements(this.elements, {connection_criteria: {connected_to: 'active'}}))
  }

  this.lightbulb = function(){
    return new Elements(Filters.filter_elements(this.elements, {type: 'lightbulb'}))
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

  return this

}


find_incoming = function(elements, status){
  if (elements.elements) {
    elements = elements.elements
  }
  if (elements && elements.length > 1){
    elements = elements[0]
  }
  console.log("checking incoming", elements, status)
  if (elements && elements.length > 0) {
    console.log("we're going in!", elements, status)
    return Filters.find_connection(elements[0], status, 'incoming')
  } else {
    console.log("abandon ship!")
    return null
  }
}
find_outgoing = function(elements, status){
  if (elements.elements) {
    elements = elements.elements
  }
  if (elements && elements.length > 1){
    elements = elements[0]
  }
  console.log("checking outgoing", elements, status)
  if (elements && elements.length > 0) {
    return Filters.find_connection(elements[0], status, 'outgoing');
  } else {
    return null
  }
}
