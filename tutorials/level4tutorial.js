var flavor_unearthed_events = function(){
  var elements = new Elements(Circuit.getElements())
  var empty_sensors = elements.sensor().output('empty').elements
  var has_incoming_active_or = elements.OR().input('active').exists()
  var or_operators = elements.OR().elements
  var first_sensor = elements.sensor().first_connection();


  if (elements.lightbulb().input('filled').exists() && !elements.OR().output('filled').exists()){
    highlightSection(elements.lightbulb().first_connection(),  true)
    createSpeechBubble(first_sensor, "The only way you'll be able to solve this is by " +
        "connecting the lightbulb to the OR operator.  You may need to erase the current connection.")
  }

  else if (or_operators.length < 1){
    createSpeechBubble(first_sensor, "This time we'll be using an OR operator.  Go ahead and put one on screen.")
  }

  else if (or_operators.length > 1){
    createSpeechBubble(first_sensor, "We'll only need one OR operator for this.")
  }

  //the next two disappear too soon.  They should accept "active" as well as "empty"`
  else if (empty_sensors.length == 2 || (empty_sensors.length == 1 && elements.sensor().active_connection().exists())){
    var operator = or_operators[0]
    //this should show both of them
    var input = operator.connects[0]
    $.each(operator.connects,function(i, connection){

      if (connection.input){
        input = connection
        highlightSection(connection, true)
      }
    })
    createSpeechBubble(first_sensor, "this operator has two inputs.  Select one and attach it to a sensor.") ;
  }

//  else if (empty_sensors.length == 2 && has_incoming_active_or){
//    //highlight two sensor outgoings
//    highlightSection(empty_sensors[0].connects[0], true)
//    highlightSection(empty_sensors[1].connects[0], true)
//  }

  else if (empty_sensors.length == 1 || elements.sensor().active_connection().exists()) {
    //highlight the remaining outgoing sensor and incoming OR
    highlightSection(empty_sensors[0].connects[0], true)
    highlightSection(Filters.find_connection(or_operators[0], '', true), true)
    createSpeechBubble(first_sensor, "Now connect the other...")
  }

  else if (empty_sensors.length == 0){
    createSpeechBubble(first_sensor, "Great!  Now if either green or blue is true, the OR will output true.")
  }
}
//
//var start4 = [
//    test_lightbulb(''),
//    test_sensor(2, 'green', ''),
//    test_sensor(3, 'blue', '')
//]
//
//var one_empty_OR = [
//  test_lightbulb(''),
//  test_sensor(2, 'green', ''),
//  test_sensor(3, 'blue', ''),
//  test_OR(4, '', '', '')
//]
//
//var two_ORs = [
//  test_lightbulb(''),
//  test_sensor(2, 'green', ''),
//  test_sensor(3, 'blue', ''),
//  test_OR(4, '', '', ''),
//  test_OR(5, '', '', '')
//]
//
//var wrong_lightbulb_connection = [
//  test_lightbulb(2) ,
//  test_sensor(2, 'green', 1),
//  test_sensor(3, 'blue', ''),
//  test_OR(3, '', '', '')
//]
//
//
//var making_first_connection = [
//  test_lightbulb(''),
//  test_sensor(2, 'green', ''),
//  test_sensor(3, 'blue', ''),
//  test_OR(4, 'active', '', '')
//]
//
//var first_connection_made = [
//  test_lightbulb(''),
//  test_sensor(2, 'green', 4),
//  test_sensor(3, 'blue', ''),
//  test_OR(4, '', 2, '')
//]
//
//var two_connections_made = [
//  test_lightbulb(''),
//  test_sensor(2, 'green', 4),
//  test_sensor(3, 'blue', 4),
//  test_OR(4, 3, 2, '')
//]