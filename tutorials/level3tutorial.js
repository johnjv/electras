var not_what_I_mint_events = function(){
  var elements = new Elements(NOT_incoming_empty) //getElements();

  if (!elements.NOT().exists()){
    createSpeechBubble(elements.lightbulb().first_connection(), "We'll be using the NOT operator.  Whatever is put into it comes out the opposite!")
  }

  else if (elements.NOT() && elements.NOT().elements.length > 1){
    createSpeechBubble(elements.NOT().first_connection(), "We'll only need one NOT operator for this.")
  }

  else if (elements.NOT().input('empty').exists()){
    console.log('made it to the third choice', elements.NOT().input('empty'))
    var operator_input = Filters.find_connection(elements.NOT().elements[0], 'empty', 'incoming')//find_incoming(elements.NOT().input('empty'), 'empty')
    console.log('OPERATOR INPUT', operator_input)
    var sensor_output = Filters.find_connection(elements.sensor('mint').elements[0], 'empty', 'outgoing')
    highlightSection(operator_input, true)
    highlightSection(sensor_output, true)
    createSpeechBubble(operator_input, "Great!  Now connect the mint sensor to the input of the NOT operator") ;
  }

  else if (elements.NOT().input('filled').exists() &&
      (elements.NOT().output('empty').exists() || elements.lightbulb().input('empty').exists())) {
    //if the first part of the operator is filled in, but either the outgoing part of the NOT operator or the incoming part of the lightbulb is still empty
    var operator_output = Filters.find_connection(elements.NOT().output('empty').elements[0], 'empty', 'outgoing')
    var lightbulb_input = elements.lightbulb().first_connection()
    highlightSection(operator_output, true)
    highlightSection(lightbulb_input, true)
    createSpeechBubble(operator_output, "Now just finish it off.")
  }
}

var test_OR = function(id, incoming1, incoming2, outgoing){
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


var start3 = [
  test_lightbulb(''),
  test_sensor(2, 'mint', '')
]

var two_NOTs = [
  test_lightbulb(),
  test_sensor(2, 'mint', ''),
  test_NOT(3, '', ''),
  test_NOT(4, '', '')
]

var NOT_incoming_empty = [
    test_lightbulb('') ,
    test_sensor(2, 'mint', ''),
    test_NOT(3, '', '')
]


var NOT_incoming_filled = [
  test_lightbulb('') ,
  test_sensor(2, 'mint', 3),
  test_NOT(3, 2, '')
]
