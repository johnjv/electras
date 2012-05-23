$(document).ready(function(){
	"use strict";
	Placer.placing();	
	
	$("#showLevels").click(function(){
		LevelSelector.showSelector(true);			
	});	
	
	$("#advanceLevel").click(function(){	    
		LevelSelector.advanceLevel(true);
		updateChalkBoard();
	});
	
	$("#start").click(function(){		
		startMachine();
		var box = $('#box');
		var boxPos = box.offset();
		console.log(boxPos.left + " and " + boxPos.top);
	});
	
	$(window).resize(function() {
		Placer.placing();
	});
});
		
function startMachine(){
	var items = createPictures();
	var count =0;
	var candies = getLevelType();
	
	function startNext(){
		if(count < 8) {
			var check = candies[count].checkCandy();
			if (check === 1) console.log(count + " Correct");
			
			else if (check === 0){
			    console.log(count + " Push away, mark X");
			    moveArm();
			    var flag = placeFlag();
	            moveFlag(flag);
			}
			else if(check === -1){
			    console.log(count + " Pushed away, correct");
			    moveArm();
			}
			else{
			   console.log(count + " Kept, mark X");
			   var flag = placeFlag();
	           moveFlag(flag);
			}
			placeCandy(items[count]);
		    moveCandy(items[count]);
			count++; 
			
			setTimeout(startNext, 3000);
		}
	}
	startNext();
}

function getLevelType(){
	"use strict";
	var level;
	level = LevelSelector.getCurrentLevel();
	var typeInfo = new Array();		
	var analyze = level.analyze();
	
	for (var i=0; i < 8 ; i+=1){
		var type = analyze[i].type;
		var levelSays = analyze[i].levelSays;
		var circuitSays = analyze[i].circuitSays.accept;
	 	typeInfo[i] = new Candy(type, levelSays,circuitSays);
	}
	return typeInfo;
}

function createPictures(){
	var picArray = [];
	var candyInfo = getLevelType();	
	for (var j = 0; j < candyInfo.length;j+=1){	
		var candyName = candyInfo[j].type;	    
		picArray[j] = candyInfo[j].picture;
	}
	return picArray;
}

function placeCandy(candyPic){
	"use strict";
	var machine, candyPos, items;
    candyPic.width(20);
    machine = $('#machine');
    machine.append(candyPic);
    $(candyPic).each(function(){
    	candyPos = candyPic.offset();
    	candyPos.left += machine.width();
    	candyPos.top += machine.height()/2 - 350; 
   	 	candyPic.offset(candyPos);
   	 	
    });  
}

function placeFlag(){
	"use strict";
	var flag, puncher, machine, flagPos;
	flag = $('<img src="../Floor/resource-image/envx.png"></img>');
	puncher = $('#candypuncher');
	machine = $('#machine');
	flag.width(20);
	machine.append(flag);
	$(flag).each(function(){
    	flagPos = flag.offset();
    	flagPos.left += machine.width(); 
    	flagPos.top += machine.height()/2 - 320; 
   	 	flag.offset(flagPos);
    });
    return flag
}

function getOrder(){
	"use strict";
	var level = LevelSelector.getCurrentLevel();
	var order = level.orderText;
	return order;
	console.log(order);
}

function updateChalkBoard(order){
	"use strict"
	var orderText = getOrder();
	$('#order').text(orderText);
}

function moveCandy(candyPic){
	"use strict";    	
	$(candyPic).animate({
    	left: '-=300'
    }, 3000); 
    $(candyPic).animate({
    	left: '-=70',
    	width: '-=10',
    }, 3000); 
}

function moveFlag(flag){
	"use strict";
	$(flag).animate({
		left:'-=300' 
	},3000);
	$(flag).animate({
		height: 'toggle'
	},3000);
}

function moveArm(){
	$('#candypuncher').animate({top: '+=5%'}, 1500);
	$('#candypuncher').animate({top: '-=5%'}, 1000);
}

var FactoryFloor = (function($) {
    "use strict";
    var my = {}; 

    my.levelChanged = function(oldLevel, newLevel) {
	    level = newLevel;
	    updateChalkBoard();
    };

    my.getleverLocation = function(){
	    "use strict";
	    var leverLocation, leverPos;
	    leverPos = $("#lever").offset();
	    leverLocation = new Object();
	    leverLocation.x = leverPos.left;
	    leverLocation.y = leverPos.top;
	    leverLocation.width = $("#lever").width();
	    leverlocation.height = $("#lever").height();         
	    return leverLocation;                
    };

    my.getAdvanceLocation = function(){
	    "use strict";
	    var advanceLocation, advancePos;
	    advancePos = $("#advanceLevel").offset();
	    advanceLocation = new Object();
	    advanceLocation.x = advancePos.left;
	    advanceLocation.y = advancePos.top;
	    advanceLocation.width = $("#advanceLevel").width();
	    advanceLocation.height = $("#advanceLevel").height();
	    return advanceLocation;
    };
    
    return my;
}(jQuery));
