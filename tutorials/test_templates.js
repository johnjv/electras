var test_sensor = function(id, type, connection){
  connection = arrayify(connection)
  return {
    id: id,
    type: type + " sensor",
    connections: [
      {
        connection_type: 'outgoing',
        x: 5,
        y: 10,
        width: 50,
        height: 50,
        connected_to: connection
      }
    ]
  }
}

var test_lightbulb = function(connection){
  return {
    id: '1',
    type: 'lightbulb',
    connections: [
      {
        connection_type: 'incoming',
        x: 5,
        y: 10,
        width: 10,
        height: 10,
        connected_to: connection
      }
    ]
  }
}

var test_OR = function(id, incoming1, incoming2, outgoing){
  outgoing = arrayify(outgoing)
  return {
    id: id,
    type: "OR",
    connections: [
      {
        connection_type: 'incoming',
        x: 5,
        y: 10,
        width: 100,
        height: 200,
        connected_to: incoming1
      },

      {
        connection_type: 'incoming',
        x: 10,
        y: 15,
        width: 100,
        height: 200,
        connected_to: incoming2
      },

      {
        connection_type: 'outgoing',
        x: 15,
        y: 20,
        width: 100,
        height: 200,
        connected_to: outgoing
      }
    ]
  }
}


var test_NOT = function(id, incoming, outgoing){
  outgoing = arrayify(outgoing)
  return {
    id: id,
    type: "NOT",
    connections: [
      {
        connection_type: 'incoming',
        x: 2,
        y: 8,
        width: 100,
        height: 200,
        connected_to: incoming
      },
      {
        connection_type: 'outgoing',
        x: 15,
        y: 20,
        width: 100,
        height: 200,
        connected_to: outgoing
      }
    ]
  }
}

var arrayify = function(input){
  if(typeof input == 'string' || typeof input == 'number'){
    return [input]
  } else {
    return input
  }
}