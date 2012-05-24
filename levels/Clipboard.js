$(document).ready(function(){
	"use strict";
	
	$("#next").click(function(){
		LevelSelector.advanceLevel(true); 
		updateChalkBoard();
		updateLevelName();
	});
	
	$("#prev").click(function(){
		LevelSelector.previousLevel(true); 
		updateChalkBoard();
		updateLevelName();
	});
	
	$("#showLevels").click(function(){
		LevelSelector.showSelector(true);			
	});
	
	$("#start").click(function(){
		updateChalkBoard();
		startMachine();
	});
	
	$("#tip").click(function(){
		$('#clipboard').show();	
		$('#clipboard').animate({
           'bottom' : "+=45%"
           }, 1000, function() {     
        }); 
        $('#cliptip').hide();   	
	});
	
	$("#hint").click(function(){
		console.log("show hint here");
	});
});	

	
function updateChalkBoard(order){
	"use strict"
	var level = LevelSelector.getCurrentLevel();
	$('#order').text("Order: " + level.orderText);
}	

function getHint(){
    var level = LevelSelector.getCurrentLevel();
    return level.hint;
}

function updateLevelName(){
    var level = LevelSelector.getCurrentLevel();
    $('#levelname').text(level.levelid + ". " + level.levelname);
}   
