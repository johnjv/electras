$(document).ready(function(){
	setCircuitSound();
    $("#tally").hide();
   	$("#success").hide();
   	$("#failure").hide();
	var startIm = $("#start");
	var animationAlive = false;
	
	function starter(e) {
		e.preventDefault();
	};

	function startAll(){
		if(!animationAlive){
			animationAlive = true;
			clearTable();
			startMachine(function(){
				animationAlive = false;
			});
			$("#tally").show();
		}
	}
	starter.prototype.onRelease = function () {
		startAll();
		$("#tip").hide();
	};
	multidrag.register(startIm, starter);
});  

function setCircuitSound(){
	Circuit.addChangeListener(function(e) {
	if (e.type === 'wireStart') {
		playSound('electric_sound');}
	else if(e.type === 'eraseWire' || e.type === 'eraseElement') {
		playSound('eraser_sound');}
	else if(e.type ==='moveOut') {
		playSound('garbage_sound');}
	else if(e.type === 'wireFailed') {
		playSound('incorrect_sound');}
	else if(e.type === 'addDone' || e.type === 'moveDone') {
		playSound('click_sound');}
	else if(e.type === 'wireDone') {
		playSound('electric_sound');
		playSound('correct2_sound');}
	});
}

function playSound(sound_id) {
	if(FactoryFloor.getSoundState()) {
		var sound = $('#' + sound_id)[0];
		sound.play();
	}
}

function pauseSound(sound_id) {
	if(FactoryFloor.getSoundState()) {
		var sound = $('#' + sound_id)[0];
		sound.pause();
	}
}

function startMachine(onDone){
    var count =0;
    var candies = getLevelType();
    var correctSet = true;
   	playSound('belt_sound');
    startNext();
    
    function startNext(){
    	var failedCandy;
        if(count < candies.length) {
            var check = candies[count].checkCandy();
            var levelMark = false;
            var circuitMark = false;
            if (check === 1) {
                    circuitMark = true;
                    levelMark = true;
            }

            else if (check === 0){
                    circuitMark = false;
                    levelMark = true;
                    correctSet = false;
            }
            else if(check === -1){
                    circuitMark = false;
                    levelMark = false;
            }
            else if (check === 2){
                    circuitMark = true;
                    levelMark = false;
                    correctSet = false;
     				failedCandy = candies[count].src;
            }
            animateEach(candies[count],circuitMark,levelMark);
            count++;                        
            setTimeout(startNext, 3000);
        }
		else{
			$("#tip").show();
			onDone();
			pauseSound('belt_sound');
			if (correctSet) {
				LevelSelector.setComplete(true);
				checkComplete();
				showMessage($("#success"));
			}
			else{
				LevelSelector.setComplete(false);
				showMessage($("#failure"));
				$("#failedCandy").append(failedCandy);
			}
		}
    }
}

function animateEach(candy,cir, lev) {
	placeCandy(candy);
	moveCandy(candy);
	createTally(candy.src,cir,lev);
	Circuit.setState(candy.circuitSays);
}

function getLevelType(){
    "use strict";
    var level;
    level = LevelSelector.getCurrentLevel();
    var analyze = level.analyze();
    var typeInfo = new Array();     
    
    for (var i=0; i < analyze.length ; i+=1){
        var type = analyze[i].type;
        var levelSays = analyze[i].levelSays;
        var circuitSays = analyze[i].circuitSays;
        typeInfo[i] = new Candy(type, levelSays,circuitSays);
    }
    return typeInfo;
}

function createTally(picture, circuitSays, levelSays){
   	"use strict";
   	Placer.place();
    var xflag = '<img src="../Floor/resource-image/envx.png" id="xflag"></img>';
    var checkmark = '<img src="../Floor/resource-image/checkmark.png" id="checkmark"></img>';
    var boxTally = '<img src="../Floor/resource-image/box.png" id="boxTally"></img>';
	var trashTally = '<img src="../Floor/resource-image/trash.png" id="trashTally"></img>';  
    
    $("#frow").append("<td class='upperrow'>" + picture + "</td>");
    
    if(circuitSays) { $("#srow").append("<td class='checkmarks'>" + boxTally + "</td>");}
    else { $("#srow").append("<td class='flags'>" + trashTally + "</td>");}
        
    if(levelSays) { $("#trow").append("<td class='checkmarks'>" + boxTally + "</td>");}
    else { $("#trow").append("<td class='flags' >" + trashTally + "</td>"); }
        
    if(levelSays === circuitSays) { $("#forow").append("<td class='checkmarks'>" + checkmark + "</td>");}
    else { $("#forow").append("<td class='flags'>" + xflag + "</td>"); }
}

function placeCandy(candy){
    "use strict";
    var candyPic = candy.picture;
    candyPic.width('3%');
    var factory = $('#factory');
    var dropper = $("#dropper");
	var x = dropper.position().left;
    var y = dropper.position().top + dropper.height()/2.0 - candyPic.height()/2.0;
    candyPic.css('left', x).css('top', y);
    factory.append(candyPic);
}

function moveCandy(candy){
    "use strict";
    var posleft, posdown;
    var candyPic = candy.picture;
    var belt = $('#belt');
    var box = $('#box');
    var dropper = $('#dropper');
    var glove = $("#glove");
    var trash = $("#trash");
    var punchingBox = $('#punchingbox');
    posleft = glove.position().left;
    posdown = trash.position().top - candyPic.position().top + candyPic.height() + trash.height()/4.0; 
        
    if(candy.checkCandy() === -1) {
        $(candyPic).animate({left:posleft},1500, 'linear', function(){movePuncher();});
    	$(candyPic).animate({top:'+=' + posdown, width: '-=0' + candyPic.width()}, 600, 'linear',
    		function(){
				playSound('garbage_sound');			
				playSound('correct_sound');
        });
    }
        
    else if(candy.checkCandy() === 0){
        $(candyPic).animate({left:posleft},1500, 'linear', function() {
        	var flag = putAFlag(); 
        	posdown = trash.position().top - flag.position().top + trash.height()/2.0;
        	$(flag).animate({top: '+=' + (posdown),width: '-=0' + flag.width()}, 600, 'linear');
			movePuncher();
        });
		$(candyPic).animate({top:'+=' + posdown, width: '-=0'+ candyPic.width()}, 600, 'linear',function() {
        	playSound('garbage_sound');});
    }
        
    else if(candy.checkCandy() === 2){
        $(candyPic).animate({left:posleft},1500, 'linear', 
			function(){
				var flag = putAFlag();
				moveFlag(flag);
		});
        posleft = glove.position().left - belt.position().left;
        posdown = box.width()/3.0;
        $(candyPic).animate({left: '-=' + posleft}, 3000, 'linear'); 
        $(candyPic).animate({left: '-=' + (posdown),width: '-=0'+ candyPic.width()}, 1500, 'linear');
            
    }
        
    else {
        posleft = dropper.position().left - belt.position().left;
        posdown = box.width()/3.0;
        $(candyPic).animate({left: '-=' + posleft}, 3000, 'linear', 
			function(){
				playSound('correct_sound');
		}); 
        $(candyPic).animate({left: '-=' + (posdown),width: '-=0'+candyPic.width()}, 1500, 'linear');
	}
}

function putAFlag(){
    "use strict";
    var flag = $('<img src="../Floor/resource-image/envx.png" id="flag"></img>');
    var dropper = $('#dropper');
    var flagPos;
    var factory = $('#factory');
    var glove = $('#glove');
    flag.width('2%');
    var x = glove.position().left;
    var y = dropper.position().top + dropper.height()/2.0 - flag.width() * 2.0;
    flag.css('left', x).css('top', y);
    factory.append(flag);
    playSound('incorrect_sound');
    return flag;
}

function moveFlag(flag){
    "use strict";
    var belt = $('#belt');
    var glove = $('#glove');
    var x = flag.offset().left - belt.offset().left;
    $(flag).animate({left:'-=0' + x},3000, 'linear');
    $(flag).animate({width: '-=0' + flag.width()}, 1500, 'linear');
}

function movePuncher(){
	"use strict";
    var belt = $('#belt');
    $('#glove').animate({top: '+=0' + belt.height()/3.0}, 
                            (1000/ $("#glove").position().left),'linear', function() {
                                    playSound('punch_sound');});
    $('#glove').animate({top: '-=0' + belt.height()/3.0}, 600,'linear');
}

function clearTable(){
	"use strict";
    $(".upperrow").remove();
    $(".checkmarks").remove();
    $(".flags").remove();
}

function showMessage(mess){
	"use strict";
	mess.show();
	mess.fadeOut(20000, function(){
		mess.hide();
	});
	
}

var FactoryFloor = (function($) {
    "use strict";
    var my = {}; 
	var soundState = true;
	
    my.levelChanged = function() {
    	clearTable();
    	$("#tally").hide();
    	Placer.place();
    	$("#success").hide();
    	$("#failure").hide();
    };
    
    my.windowResized = function () {
	    var par;
	    par = $('#main_container');
	    $('#factoryParent').width(par.width()).height(par.height());
	    $('#factory').width(par.width()).height(par.height());
	    $('#factoryParent').offset(par.offset());
	    Placer.place();
	}; 
	
	my.setSoundState = function(boolean_value) {
		soundState = boolean_value;
	};
	
	my.getSoundState = function() {
		return soundState;
	};
	
    return my;              
}(jQuery));
