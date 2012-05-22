var not_what_I_mint_events = function(){
  var elements = new Elements(wrong_lightbulb_connection) //getElements();

  if (!elements.NOT().exists()){
    createSpeechBubble(elements.lightbulb().first_connection(), "We'll be using the NOT operator.  Whatever is put into it comes out the opposite!")
  }

  else if (elements.NOT() && elements.NOT().elements.length > 1){
    createSpeechBubble(elements.NOT().first_connection(), "We'll only need one NOT operator for this.")
  }

  else if (elements.lightbulb().input('filled').exists() && !elements.NOT().output('filled').exists()){
    highlightSection(elements.lightbulb().first_connection(),  true)
    createSpeechBubble(elements.lightbulb().first_connection(), "The only way you'll be able to solve this is by " +
        "connecting the lightbulb to the NOT operator.  You may need to erase the current connection.")
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

var wrong_lightbulb_connection = [
  test_lightbulb(2) ,
  test_sensor(2, 'mint', 1),
  test_NOT(3, '', '')
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
