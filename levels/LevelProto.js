function setUpLevel(){
    $('#levelSelect2').hide();
    $('#levelSelect3').hide();
    $('#right2').hide();
    $('#left2').hide();
    $('#left3').hide();
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
         if(all_levels.length > 20){
             $('#right2').show();
         }         
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
    $("#levels3").children().remove();
    level = all_levels;    
    for(i = 0; i < level.length; i+=1){
        html = checkFinish(level[i], i+1);
        if(i <= 9){
            $('#levelSelect1').append(html);      
        }
        else if(9 < i & i <=19){
            $('#levelSelect2').append(html);
        }
        else{
            $('#levelSelect3').append(html);
        }
   }
    addChildClicks();          
}    

function checkFinish(level, id){
    "use strict";
    var html, check;
    var  j = 0;   
    html = '<tr id = "row' + (id) + '"><td id=" level' + (id) + '"><b>' + (id) + '. ' + level.levelname + '</b></td></tr>';        
    if(level.complete){ 
        check = '<img src = "images/checkmark.png" id = "check">';   
        html = '<tr id = "row' + (id) + '"><td id=" level' + (id) + '"><b>' + (id) + '. ' + level.levelname + '</b>' + check + '</td></tr>';
    }        
    return html;
}

function addChildClicks(){
    "use strict";
    $('#levels1').children().each(function(i, child) {
        $(child).click( function(){
             $('#levelSelect1').hide();
             $('#arrow1').hide(); 
             $('#title').hide();
             level = all_levels[i+1];                 
             window.location = '../Floor/FactoryFloor.html';
        });
      });
      
    $('#levels2').children().each(function(i, child) {        
         $(child).click( function(){                                    
             $('#levelSelect2').hide();  
             $('#arrow2').hide(); 
             $('#title').hide(); 
             level = all_levels[i+11];                      
             window.location = '../Floor/FactoryFloor.html';             
        });
      });
      
    $('#levels3').children().each(function(i, child) {
         $(child).click( function(){                       
             $('#levelSelect3').hide();
             $('#arrow3').hide(); 
             $('#title').hide();
             level = all_levels[i+21];                       
             window.location = '../Floor/FactoryFloor.html';
           });
      });
}

var LevelSelector = (function($) {
    "use strict";
    var my = {};                 
    var level = all_levels[0];
    
    $(document).ready(function () {
       setUpLevel(); 
       console.log(level.analyze());      
    });

    my.advanceLevel = function(finish){
        if(finish){ 
            level.complete = true;
        }       
        level = all_levels[level.levelid + 1];
    };

    my.showSelector = function(finish){ 
        window.location("../levels/LevelProto.html");
        if(finish){
            level.complete = true;
        }
        makePage();
        if(currentId <= 10){
            $('#levelSelect1').show();
            $('#arrow1').show();
            $('#title').show();
        }
        else if(currentId > 10 & currentId <= 20 ){
            $('#levelSelect2').show();
            $('#arrow2').show();
            $('#title').show();
        }
        else{
            $('#levelSelect3').show();
            $('#arrow3').show();
            $('#title').show();
        }    
    };

   my.getCurrentLevel = function(){      
      return level;
    };
    
}(jQuery));
