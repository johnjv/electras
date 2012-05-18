var page1 = true;        
var page2 = false;       
var page3 = false;      
var cleared = [];        
var currentId = 0;           
var Level = new Level;   
    

$(document).ready(function () {    
    
    $('#right1').click(function(){
        page1 = false;
        page2 = true;        
        page3 = false;        
        $( "#levelSelect1:first" ).animate({
           'marginLeft' : "-=25%"
           }, 1000, function() {     
        });
        
        $('#levelSelect1').hide();
        $('#right1').hide();
    
         $('#levelSelect2').show();
         $('#left2').show();
         if(all_levels.length > 20){
             $('#right2').show();
         }         
        $( "#levelSelect2:first" ).animate({
           'marginLeft' : "-=25%"             
           }, 1000, function() {              
        });
    
        $( "#levelSelect3:first" ).animate({
           'marginLeft' : "-=25%"
           }, 1000, function() {
        });
        $('#levelSelect3').hide();  
    });
        
    $('#left2').click(function(){
        page1 = true;
        page2 = false;        
        page3 = false;        
        $( "#levelSelect1:first" ).animate({
           'marginLeft' : "+=25%"
           }, 1000, function() {     
        });
        
        $('#levelSelect1').show();
        $('#right1').show(); 
        
        $('#levelSelect2').show();
        $( "#levelSelect2:first" ).animate({
           'marginLeft' : "+=25%"
           }, 1000, function() {   
        });
        $('#levelSelect2').hide();
        $('#right2').hide();
        $('#left2').hide();
    
        $( "#levelSelect3:first" ).animate({
           'marginLeft' : "+=25%"
           }, 1000, function() {
        });
        $('#levelSelect3').hide();  
    });
    
    $('#right2').click(function(){
        page1 = false;
        page2 = false;        
        page3 = true; 
         $( "#levelSelect1:first" ).animate({
           'marginLeft' : "-=25%"
           }, 1000, function() {     
        });
        
        $('#levelSelect1').hide();
        $('#right1').hide(); 
        
        $('#levelSelect2').show();
        $( "#levelSelect2:first" ).animate({
           'marginLeft' : "-=25%"
           }, 1000, function() {   
        });
        $('#levelSelect2').hide();
        $('#right2').hide();
        $('#left2').hide();
    
        $('#levelSelect3').show();
        $('#left3').show();
        $( "#levelSelect3:first" ).animate({
           'marginLeft' : "-=25%"
           }, 1000, function() {
        });        
    });      
    
    
    $('#left3').click(function(){
        page1 = false;
        page2 = true;        
        page3 = false; 
        $( "#levelSelect1:first" ).animate({
           'marginLeft' : "+=25%"
           }, 1000, function() {     
        });
        
        $('#levelSelect1').hide(); 
        $('#right1').hide(); 
        
        $('#levelSelect2').show();
        $( "#levelSelect2:first" ).animate({
           'marginLeft' : "+=25%"
           }, 1000, function() {   
        });
        $('#levelSelect2').show();
        $('#right2').show();
        $('#left2').show();
    
        $( "#levelSelect3:first" ).animate({
           'marginLeft' : "+=25%"
           }, 1000, function() {
        });
        $('#levelSelect3').hide();
        $('#left3').hide();        
    });   
     
    
           
    makePage(cleared);     
    $('#levelSelect2').hide();
    $('#levelSelect3').hide();
    $('#right2').hide();
    $('#left2').hide();
    $('#left3').hide();
});


function advanceLevel(finish){
    "use strict";      
    if(finish){                              
        cleared.push(currentId);               
    }  
    currentId += 1;               
    getCurrentLevel(currentId);
        
}


function prevLevel(finish){ 
    "use strict";     
    if(finish){                              
        cleared.push(currentId);               
    }  
    currentId -= 1;               
    getCurrentLevel(currentId);         
}


function showSelector(finish){  
    "use strict";   
    if(finish){                       
        cleared.push(currentId);        
    }       
    makePage(cleared);
    if(page1){
        $('#levelSelect1').show();
        $('#arrow1').show();
        $('#title').show();
    }
    if(page2){
        $('#levelSelect2').show();
        $('#arrow2').show();
        $('#title').show();
    }
    if(page3){
        $('#levelSelect3').show();
        $('#arrow3').show();
        $('#title').show();
    }    
}


function getCurrentLevel(){
      "use strict";
      return Level.getMe(currentId);
}


function makePage(finished){
    "use strict";
    var i = 0;
    var html; 
    var levels = [];   
    //deleteTables();
    $("levelSelect1 > tbody: #levels1").children().remove();
    $("levelSelect2 > tbody: #levels2").children().remove();
    $("levelSelect3 > tbody: #levels3").children().remove();
    levels = Level.getLevelNames();    
    for(i = 0; i < levels.length; i+=1){
        html = checkFinish(finished, levels[i].levelname, levels[i].levelid);
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


function checkFinish(finished, levels, id){
    "use strict";
    var html, check;
    var  j = 0;   
    html = '<tr id = "row' + (id) + '"><td id=" level' + (id) + '"><b>' + (id) + '. ' + levels + '</b></td></tr>';        
    for(j = 0; j < finished.length ; j += 1){        
        if(id === finished[j]){ 
            check = '<img src = "images/checkmark.png" id = "check">';   
            html = '<tr id = "row' + (id) + '"><td id=" level' + (id) + '"><b>' + (id) + '. ' + levels + '</b>' + check + '</td></tr>';
        }
    }
    return html;
}

function deleteTables(){
    "use strict";
    var Table1 = document.getElementById("levelSelect1"); 
    var Table2 = document.getElementById("levelSelect2");
    var Table3 = document.getElementById("levelSelect3");
       while(Table1.rows.length>0) 
           Table1.deleteRow(Table1.rows.length-1);
       while(Table2.rows.length>0) 
           Table2.deleteRow(Table2.rows.length-1);
       while(Table3.rows.length>0) 
           Table3.deleteRow(Table3.rows.length-1);
}


function addChildClicks(){
    "use strict";
    $('#levels1').children().each(function(i, child) {
        $(child).click( function(){ 
             currentId = i + 1;              
             $('#levelSelect1').hide();
             $('#arrow1').hide(); 
             $('#title').hide();
             console.log(currentId);
             window.location = '../Floor/FactoryFloor.html';
        });
      });
      
    $('#levels2').children().each(function(i, child) {        
         $(child).click( function(){ 
             currentId  = i + 11;                       
             $('#levelSelect2').hide();  
             $('#arrow2').hide(); 
             $('#title').hide();
             console.log(currentId);
             window.location = '../Floor/FactoryFloor.html';             
        });
      });
      
    $('#levels3').children().each(function(i, child) {
         $(child).click( function(){
             currentId = i + 21;             
             $('#levelSelect3').hide();
             $('#arrow3').hide(); 
             $('#title').hide();
             console.log(currentId);
             window.location = '../Floor/FactoryFloor.html';
           });
      });
}
