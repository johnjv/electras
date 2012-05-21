$(document).ready(function(){
	"use strict";
	var curid = 1;
	
	$("#advanceLevel").click(function(){
		advanceSelector(); // method created by the Levels/Judge team
	});
	
	$("#viewLevels").click(function(){
		showSelector(); // method created by the Levels/Judge team
	});
		
	$("#start").click(function(){
		startMachine();
	});
	
	function startMachine(){
		var items = createSequence();
		var count =0;
		
		function startNext(){
			if(count < 8) {
				if (checkCandy(count) === 1) {
					placeCandy(items[count]);
					moveCandy(items[count]);
					
				}
				
				else if (checkCandy(count) === -1){
					putAFlag();
					moveFlag();
					placeCandy(items[count]);
					moveCandy(items[count]);
					
				}
				
				else if (checkCandy(count) === 0) {
					//putIntoTrash();
					
				}
				count++; 
				moveArm();
				setTimeout(startNext, 3000);
			}
			
		}
		startNext();
	}
	

	function Candy(type){
		this.type = type;
		this.picture = "";
	}
	
	Candy.prototype.getCandyType = function(){
		return this.type;
	};
	
	Candy.prototype.setCandyPicture = function(){
		"use strict";	
		var candy;
		candy = this.type;
		candy = $.trim(candy);
		
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
	
	function setCurId(levelid){
		"use strict";
		curid = levelid;
		console.log("set curid to: " + curid );
	}
	
	function getLevelType(){
		"use strict";
		var level = getCurrentLevel(curid);
		var typeInfo = new Array();
		var levelInfo = new Array();
		
		for (var i=0; i< level.analysis.length; i+=1){
		 	typeInfo[i] = new Candy(level.analysis[i].type);
		}
		
		return typeInfo;
	}
	
	function getCircuitSays(){
		"use strict";
		var level = getCurrentLevel(curid);
		var circuitInfo = new Array();
		
		for (var i=0; i< level.analysis.length; i+=1){
		 	circuitInfo[i] = level.analysis[i].circuitSays;
		}
		
		return circuitInfo;
		
	}
	
	function getLevelSays(){
		"use strict";
		var level = getCurrentLevel(curid);
		var levelInfo = new Array();
		
		for (var i=0; i< level.analysis.length; i+=1){
		 	levelInfo[i] = level.analysis[i].levelSays;
		}
		
		return levelInfo;
	}
	
	function createSequence(){
		var picArray = [];
		var list = getLevelType();
		console.log(list);
		for (var j = 0; j<list.length;j+=1){
			picArray.push(list[j].setCandyPicture());
		}
		return picArray;
	}
	
	function checkCandy(i) {
		"use strict";
		var circuitSays = getCircuitSays();
		var levelSays = getLevelSays();
		var value; // this is a value to differentiate the cases
		
		console.log(circuitSays[i]);
		console.log(levelSays[i]);
		
		if (circuitSays[i] === false) {
			if(levelSays[i] === true) {
					value = 0;
					console.log("circuit is false, level is true");
					return value;
					//putAFlag(candyPictures[i]);		// put a flag
					//moveIntoBox(candyPictures[i]); // move into box
			}
			else{
					value = -1;
					console.log("circuit is false, level is false");
					return value;
					//moveIntoTrash(candyPictures[i]); // move this into trash
				}
			}
			
		else {
			if(levelSays[i] === true) {
					value = 1;
					console.log("circuit is true, level is true");
					return value;
					//moveIntoBox(candyPictures[i]); // move into box without flag	
			}
			else{
					value = 0;
					console.log("circuit is true, level is false");
					return value;
					//putAFlag(candyPictures[i]);
					//moveIntoBox(candyPictures[i]);
			}
		}
		
	}
	
	function placeCandy(candy){
		"use strict";
		var machine, candyPos, items;
        candy.width(20);
        machine = $('#machine');
        machine.append(candy);
        $(candy).each(function(){
        	candyPos = candy.offset();
        	candyPos.left += machine.width();  // 450 should be machine.width()
        	candyPos.top += machine.height()/2 - 60; // should be machine.height() minize something
       	 	candy.offset(candyPos);
        	machine.append(candy);
        	console.log("just added");
        });
             
    }
    
    function moveCandy(candy){
    	"use strict";
    	$(candy).animate({
        	left: '-=400'
        }, 3000); 
        $(candy).animate({
        	left: '-=50',
        	width: '-=10',
        	
        }, 500); 
    }
	
	function putAFlag(){
		"use strict";
		var flag = $('<img src="resource-image/envx.png"></img>');
		var arm = $('#arm');
		var flagPos;
		flag.width(20);
		machine = $('#machine');
		machine.append(flag);
		$(candy).each(function(){
        	flagPos = candy.offset();
        	flagPos.left += machine.width() - arm.left;  // 450 should be machine.width()
        	console.log(flagPos.left);
        	flagPos.top += machine.height()/2 - 50; // should be machine.height() minize something
       	 	flag.offset(flagPos);
        	machine.append(flag);
        	console.log("just added");
        });
	}
	
	function moveFlag(){
		"use strict";
		$(candy).animate({
			left:'-=50'
		},3000);
		$(candy).animate({
			height: 'toggle'
		},3000);
	}
	
	function levelChanged(oldLevel, newLevel){
		"use strict";
		//TODO
		level = newLevel;
		updateChalkBoard();
	}
	
	function updateChalkBoard(){
		"use strict"
		var orderText;
		orderText = Level.orderText; // from the Level team
		$('#chalkBoard').text(orderText);
	}

	function getleverLocation(){
		"use strict";
		var leverLocation, leverPos;
		leverPos = $("#lever").offset();
		leverLocation = new Object();
		leverLocation.x = leverPos.left;
		leverLocation.y = leverPos.top;
		leverLocation.width = $("#lever").width();
		leverlocation.height = $("#lever").height();
		
		return leverLocation;
		
	}

	function getAdvanceLocation(){
		"use strict";
		var advanceLocation, advancePos;
		advancePos = $("#advanceLevel").offset();
		advanceLocation = new Object();
		advanceLocation.x = advancePos.left;
		advanceLocation.y = advancePos.top;
		advanceLocation.width = $("#advanceLevel").width();
		advanceLocation.height = $("#advanceLevel").height();
		
		return advanceLocation;
	}
	
	
	function putInBox(candy){
		"use strict";
		//TODO this will change the css properties of the element that is to go in the box i.e being accepted
		//var top, newPos
		//ne
	}
	
	function moveArm(){
		$('#arm').animate({top: '+=50'}, 1500);
		$('#arm').animate({top: '-=50'}, 1000);
	}
	
	
	

});
