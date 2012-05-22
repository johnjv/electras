//when you call circuit_changed, we know the circuit has changed, and we only need to update things when this is called?
//and also when leverPushed() is called
var circuit_changed = function(){
 var script = get_current_level.script()
 call_script(script)
}

var call_script = function(script_name){
  eval(script_name + "events()")
}
window.testFirst = function(){
  all_my_chocolates_events()
}

window.testSecond = function(){
  a_bar_walks_into_my_tummy_events()
}


window.testThird = function(){
  not_what_I_mint_events()
}

window.testFourth = function(){
  i_mint_chocolate_events()
}
//var scripts = {
//  'all_my_chocolates': all_my_chocolates_events,
//  'a_bar_walks_into_my_tummy': a_bar_walks_into_my_tummy_events
//}
