var Translator = (function ($) {
  var returns = {}

  var current_language = 'EN'
  var current_texts = {}
  var listeners = []

  returns.getText = function(){
    var i = 0;
    var text = current_texts;
    while (i < arguments.length){
      try {
        text = text[arguments[i]]
      } catch (e) {
        console.log("Error finding ", arguments[i-1],  ".  The error is ", e)
        return null
      }
      i++;
    }
    return text
  }

  returns.changeLanguage = function(language_code){
    current_language = language_code

    current_texts = hashify($('#translations #' + language_code))
    $.each(listeners, function(i, listener){
        listener.call()
    })

  }

  returns.list_languages = function(){
    return $('#translations').children().map(function(i, child){return child.id})
  }

  returns.addListener = function(function_added){
    listeners.push(function_added);
  }


  var hashify = function(html){
    if ($(html).children().length > 0){
      var new_hash = {}
      $(html).children().each(function(i, child){
        new_hash[child.className] = hashify(child)
      })
      return new_hash
    } else {
      return $(html).text()
    }
  }

  return returns;
}(jQuery))

$(document).ready(function(){
  Translator.changeLanguage('EN')
})
