function setUpLevel(){
    $('#levelSelect2').hide();  
    $('#left2').hide(); 
    $('#factory').hide(); 
    $('#circuit').hide(); 
    $('#levelInfo').hide();  
    makePage(); 
    addRightClick();
    addLeftClick();
}
        
function addRightClick(){
    $('#right1').click(function(){      
        $( "#levelSelect1:first" ).animate({
           'marginLeft' : "-=25%"
           }, 1000, function() {     
        });                  
        $( "#levelSelect2:first" ).animate({
           'marginLeft' : "-=25%"             
           }, 1000, function() {              
        }); 
         $('#levelSelect1').hide();
         $('#right1').hide();    
         $('#levelSelect2').show();
         $('#left2').show();
    });
}
  
function addLeftClick(){            
    $('#left2').click(function(){        
        $( "#levelSelect1:first" ).animate({
           'marginLeft' : "+=25%"
           }, 1000, function() {
        });
        $( "#levelSelect2:first" ).animate({
           'marginLeft' : "+=25%"
           }, 1000, function() {   
        });
        $('#levelSelect1').show();        
        $('#right1').show();        
        $('#levelSelect2').hide();        
        $('#left2').hide();
    });
}

function makePage() {    
    var i = 0;
    var html; 
    var levels = [];
    $("#levels1").children().remove();
    $("#levels2").children().remove();
    level = all_levels;    
    for(i = 0; i < level.length; i+=1){
        html = checkFinish(level[i], i+1);
        if(i <= 9){
            $('#levelSelect1').append(html);      
        }
        else if(9 < i & i <=19){
            $('#levelSelect2').append(html);
        }
   }
    addChildClicks();          
}    

function checkFinish(level, id){
    "use strict";
    var html, check;
    var  j = 0;   
    html = '<tr id = "row' + (id) + '"><td id=" level' + (id) + '"><b>' + (id) + '. <u>' + level.levelname + '</u></b></td></tr>';        
    if(level.complete){ 
        check = '<img src = "images/checkmark.png" id = "check">';   
        html = '<tr id = "row' + (id) + '"><td id=" level' + (id) + '"><b>' + (id) + '. <u>' + level.levelname + '</u></b>' + check + '</td></tr>';
    }        
    return html;
}

function addChildClicks(){
    "use strict";
    $('#levels1').children().each(function(i, child) {
        $(child).click( function(){
             $('#levelSelect1').hide();
             $('#right1').hide(); 
             $('#title').hide();
             LevelSelector.setLevel(all_levels[i]);
             $('#factory').show();
             $('#levelname').html('<b>' + LevelSelector.getCurrentLevel().levelname + '</b>');
             $('#circuit').show(); 
        });
      });
      
    $('#levels2').children().each(function(i, child) {        
         $(child).click( function(){                                    
             $('#levelSelect2').hide();  
             $('#left2').hide(); 
             $('#title').hide(); 
             LevelSelector.setLevel(all_levels[i+10]);
             $('#factory').show();
             $('#levelname').html('<b>' + LevelSelector.getCurrentLevel().levelname + '</b>');
             $('#circuit').show(); 
        });
    });
}

var LevelSelector = (function($) {
    "use strict";
    var my = {};                 
    var level = all_levels[0];
    
    $(document).ready(function () {
       setUpLevel(); 
    });

    my.setLevel = function(change) {
        level = change;
        console.log(level);
    }; 
    
    my.advanceLevel = function(finish){
        if(finish){ 
            level.complete = true;
        }  
        if(level.levelid >= all_levels.length){
            alert("There are no more levels");
        }
        else{
            level = all_levels[level.levelid];
            console.log("We are now on level: " + level.levelid); 
        }
        $('#levelname').html('<b>' + LevelSelector.getCurrentLevel().levelname + '</b>');
    };
     
     
    my.showSelector = function(finish){
        if(finish){
            level.complete = true;
        }    
        makePage();    
        if(level.levelid <= 10){
         $( "#levelSelect1:first" ).animate({
           'marginLeft' : "40%"
           });
         $( "#levelSelect2:first" ).animate({
           'marginLeft' : "65%"
            });  
            $('#levelSelect1').show();            
            $('#right1').show();
            $('#title').show();
        }
        else if(level.levelid > 10 & level.levelid <= 20 ){
        $( "#levelSelect1:first" ).animate({
           'marginLeft' : "15%"
           });         
        $( "#levelSelect2:first" ).animate({
           'marginLeft' : "40%"
            });
            $('#levelSelect2').show();            
            $('#left2').show();
            $('#title').show();
        }
        $('#factory').hide();
        $('#circuit').hide();     
    };

   my.getCurrentLevel = function(){
      console.log(level);      
      return level;
    };
    return my;
}(jQuery));
