$(document).ready(function(){
	"use strict";	
	
	$("#advanceLevel").click(function(){
	    console.log("advance");
		LevelSelector.advanceLevel(true); // check whether the level was completed or not
	});
	
	$("#start").click(function(){
		updateChalkBoard();
		startMachine();
	});
	
	function startMachine(){
		var items = createPictures();
		var count =0;
		var candies = getLevelType();
		
		var flag = putAFlag();
		moveFlag(flag);
		
		function startNext(){
			if(count < 8) {
				
				if (candies[count].checkCandy() === 1) {
					//placeCandy(items[count]);
					//moveCandy(items[count]);
					console.log("this one is fine");
					placeCandy(items[count]);
					moveCandy(items[count]);
					console.log(items[count]);
					
				}
				
				else if (candies[count].checkCandy() === -1){
					//putAFlag();
					//moveFlag();
					//console.log("this one needs a flag");
					placeCandy(items[count]);
					moveCandy(items[count]);
					
				}
				
				else if (candies[count].checkCandy() === 0) {
					//putIntoTrash();
					//console.log("this one gotta go into trash");
					placeCandy(items[count]);
					moveCandy(items[count]);
					
				}
				count++; 
				moveArm();
				setTimeout(startNext, 3000);
			}
			
		}
		startNext();
	}
	

	function Candy(type, levelSays, circuitSays){
		this.type = type;
		this.picture = "";
		this.levelSays = levelSays;
		this.circuitSays = circuitSays;
	}
	
	Candy.prototype.getCandyType = function(){
		return this.type;
	};

	Candy.prototype.setCandyPicture = function(candy){
		"use strict";
		//var candy;
		//candy = this.type;
		//candy = $.trim(candy);
		
		//i = $.inArray('CRGY', candy.substring(0, 1)); // check that to see if we can write a better code	
		if (candy == 'Co') {
			this.picture = $('<img src="resource-image/candy00.png"></img>');
		}
		
		else if (candy == 'C|'){
			this.picture = $('<img src="resource-image/candy01.png"></img>');
		}
		
		else if (candy == 'C-'){
			this.picture = $('<img src="resource-image/candy02.png"></img>');
		}
		
		else if (candy == 'Ro'){
			this.picture = $('<img src="resource-image/candy10.png"></img>');
		}
		
		else if (candy == 'R|'){
			this.picture = $('<img src="resource-image/candy11.png"></img>');
		}
		
		else if (candy == 'R-'){
			this.picture = $('<img src="resource-image/candy12.png"></img>');
		}
		
		else if (candy == 'Go'){
			this.picture = $('<img src="resource-image/candy20.png"></img>');
		}
		
		else if (candy == 'G|'){
			this.picture = $('<img src="resource-image/candy21.png"></img>');
		}
		
		else if (candy == 'G-'){
			this.picture = $('<img src="resource-image/candy22.png"></img>');
		}
		
		else if (candy == 'Yo'){
			this.picture = $('<img src="resource-image/candy30.png"></img>');
		}
		
		else if (candy == 'Y|'){
			this.picture = $('<img src="resource-image/candy31.png"></img>');
		}
		
		else if (candy == 'Y-'){
			this.picture = $('<img src="resource-image/candy32.png"></img>');
		}
		
		else{
			$("#requestedCandy").text("Your candy is not available");
		}
		return this.picture;
	};
	
	Candy.prototype.checkCandy = function(){
		"use strict";
		var value; // this is a value to differentiate the cases
		var circuitSays= this.circuitSays;
		var levelSays = this.levelSays;
		console.log(circuitSays);
		console.log(levelSays);
		
		if (circuitSays === false) {
			if(levelSays) {
				value = 0;
				console.log(circuitSays + " and " + levelSays);
				return value;
			}
			else{
				value = -1;
				console.log(circuitSays + " and " + levelSays);
				return value;
			}
		}
			
		else {
			if(levelSays) {
				value = 1;
				console.log(circuitSays + " and " + levelSays);
				return value;
			}
			else{
				value = 0;
				console.log(circuitSays + " and " + levelSays);
				return value;
			}
		}
	};
	
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
			picArray[j] = candyInfo[j].setCandyPicture(candyName);
		}
		//console.log(picArray);
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
        	candyPos.top += machine.height()/2 - 60; // should be machine.height() minize something
       	 	candyPic.offset(candyPos);
        	machine.append(candyPic);
        	//console.log("just added");
        });
             
    }
    
    function moveCandy(candyPic){
    	"use strict";
    	$(candyPic).animate({
        	left: '-=400'
        }, 3000); 
        $(candyPic).animate({
        	left: '-=50',
        	width: '-=10',
        	
        }, 500); 
    }
	
	function putAFlag(){
		"use strict";
		var flag = $('<img src="resource-image/envx.png"></img>');
		var arm = $('#arm');
		var flagPos;
		var machine = $('#machine');
		flag.width(20);
		machine.append(flag);
		$(flag).each(function(){
        	flagPos = flag.offset();
        	console.log(flagPos.left);
        	flagPos.left += machine.width() - 100;  // 450 should be machine.width() - arm.left
        	console.log(flagPos.left);
        	flagPos.top += machine.height()/2 - 60; // should be machine.height() minize something
       	 	flag.offset(flagPos);
        	machine.append(flag);
        	//console.log("just added");
        });
        return flag;
	}
	
	function moveFlag(flag){
		"use strict";
		$(flag).animate({
			left:'-=300' // this should be machine.width - arm.left
		},3000);
		$(flag).animate({
			height: 'toggle'
		},3000);
	}

	
	function getOrder(){
		level = LevelSelector.getCurrentLevel();
		var order = level.orderText;
		return order;
		console.log(order);
	}
	
	function updateChalkBoard(order){
		"use strict"
		var orderText = getOrder();
		$('#order').text(orderText);
	}

	function moveArm(){
		$('#arm').animate({top: '+=50'}, 1500);
		$('#arm').animate({top: '-=50'}, 1000);
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

});
