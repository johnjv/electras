var FloorAnimation = (function ($) {
	"use strict";

	var H_WIN = 1365.33,
		W_CANDY = 80,
		W_FINAL = 40,
		X_START = 2048,
		X_GLOVE = 1480 + 104,
		X_BOX = 1440,
		X_BELT0 = 521,
		X_CAN = 250,
		Y_GLOVE_REST = H_WIN - 688,
		Y_GLOVE_OUT = H_WIN - 640,
		Y_BELT = H_WIN - 640 - W_CANDY / 2,
		Y_BOX = H_WIN - 200,
		T_CANDY_GAP = 1500,
		T_ACCEPT_SPEED = (X_START - X_GLOVE) * 2, // time for candy to reach glove
		T_ACCEPT_FALL = (Y_BOX - Y_BELT), // time for candy punched into box
		T_REJECT_SPEED = (X_START - X_BELT0) * 2, // time for candy to reach end of belt
		T_REJECT_FALL = (X_BELT0 - X_CAN) * 2, // time for candy to fall to can
		T_GLOVE_DELAY = (X_START - X_GLOVE) * 2, // time for glove to reach candy
		T_GLOVE_OUT = (Y_GLOVE_OUT - Y_GLOVE_REST), // time for glove to punch outward
		T_GLOVE_IN = T_GLOVE_OUT * 2, // time for glove to retract
		T_FADE = 500,
		T_LIGHT_DELAY = T_GLOVE_DELAY - T_GLOVE_OUT;

	function createCandy(type, tStart, accept) {
		var trimType, color, shape, src, elt;
		trimType = $.trim(type);
		color = 'CRGY'.indexOf(trimType[0]);
		shape = 'o|-'.indexOf(trimType[1]);
		src = imgpath.get('resource/floor/candy' + color + shape, ['svg', 'png']);
		elt = $('<img></img>')
			.attr('src', src)
			.css({left: X_START, top: Y_BELT, width: W_CANDY})
			.delay(tStart);
		if (accept) {
			elt.animate({left: '-=' + (X_START - X_GLOVE)},
					{duration: T_ACCEPT_SPEED, easing: 'linear', queue: true})
				.animate({left: '-=' + (X_GLOVE - X_BOX),
					top: '+=' + (Y_BOX - Y_BELT), width: W_FINAL},
					{duration: T_ACCEPT_FALL, easing: 'linear', queue: true})
				.animate({opacity: 0},
					{duration: T_FADE, easing: 'linear', queue: true,
						complete: function () { elt.remove(); }});
		} else {
			elt.animate({left: '-=' + (X_START - X_BELT0)},
					{duration: T_REJECT_SPEED, easing: 'linear', queue: true})
				.animate({left: '-=' + (X_BELT0 - X_CAN), width: W_FINAL},
					{duration: T_REJECT_FALL, easing: 'linear', queue: true})
				.animate({opacity: 0},
					{duration: T_FADE, easing: 'linear', queue: true,
						complete: function () { elt.remove(); }});
		}
		return elt;
	}

	function animateGlove(seq) {
		var seq, glove, lastGloveIn, i, t;
		glove = $('#punchglove');
		lastGloveIn = 0;
		for (i = 0; i < seq.length; i += 1) {
			if (seq[i].circuitSays.accept) {
				t = i * T_CANDY_GAP;
				console.log('punch', i, t + T_GLOVE_DELAY, lastGloveIn);
				glove.delay(t + T_GLOVE_DELAY - T_GLOVE_OUT - lastGloveIn)
					.animate({top: '+=' + (Y_GLOVE_OUT - Y_GLOVE_REST)},
						{duration: T_GLOVE_OUT, easing: 'linear', queue: true})
					.animate({top: '-=' + (Y_GLOVE_OUT - Y_GLOVE_REST)},
						{duration: T_GLOVE_IN, easing: 'linear', queue: true});
				lastGloveIn = t + T_GLOVE_DELAY + T_GLOVE_IN;
			}
		}
	}

	function my() {
		var candies, seq, i, elt;

		candies = $('<div></div>').attr('id', 'candies');
		seq = computeSequence(LevelSelector.getCurrentLevel());

		this.seq = seq;
		this.candies = candies;

		for (i = 0; i < seq.length; i += 1) {
			console.log(seq[i]);
			elt = createCandy(seq[i].type, i * T_CANDY_GAP,
				seq[i].circuitSays.accept);
			candies.append(elt);
		}
		animateGlove(seq);
		$('#factory').append(candies);
	}

	my.prototype.remove = function () {
		this.candies.remove();
	};

	my.prototype.pause = function () {
	};

		/*
		if (!animationAlive) {
			animationAlive = true;
			clearTable();
			startMachine(function () {
				animationAlive = false;
			});
			$("#tally").show();
		}
		*/

/*
	function startMachine(onDone){
		var count, candies, correctSet;
		count = 0;
		candies = getLevelType();
		correctSet = true;
		Audio.play('belt_sound');
		startNext();

		function startNext() {
			var failedCandy;
			if(count < candies.length) {
				var check = candies[count].checkCandy();
				var levelMark = false;
				var circuitMark = false;
				if (check === 1) {
					circuitMark = true;
					levelMark = true;
				} else if (check === 0) {
					circuitMark = false;
					levelMark = true;
					correctSet = false;
				} else if(check === -1) {
					circuitMark = false;
					levelMark = false;
				} else if (check === 2) {
					circuitMark = true;
					levelMark = false;
					correctSet = false;
					failedCandy = candies[count].src;
				}
				animateEach(candies[count],circuitMark,levelMark);
				count++;                        
				setTimeout(startNext, 3000);
			} else {
				$("#tip").show();
				onDone();
				Audio.pause('belt_sound');
				if (correctSet) {
					LevelSelector.setComplete(true);
					checkComplete();
					showMessage($("#success"));
				} else {
					LevelSelector.setComplete(false);
					showMessage($("#failure"));
					$("#failedCandy").append(failedCandy);
				}
			}
		}
	}

	function animateEach(candy, cir, lev) {
		placeCandy(candy);
		moveCandy(candy);
		createTally(candy.src, cir, lev);
		Circuit.setState(candy.circuitSays);
	}


	function createTally(picture, circuitSays, levelSays){
		layoutImages();
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
					Audio.play('garbage_sound');			
					Audio.play('correct_sound');
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
				Audio.play('garbage_sound');});
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
					Audio.play('correct_sound');
			}); 
			$(candyPic).animate({left: '-=' + (posdown),width: '-=0'+candyPic.width()}, 1500, 'linear');
		}
		$(candyPic).fadeOut(600, function(){
			$(candyPic).hide();
		});
	}

	function putAFlag(){
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
		Audio.play('incorrect_sound');
		return flag;
	}

	function moveFlag(flag){
		var belt = $('#belt');
		var glove = $('#glove');
		var x = flag.offset().left - belt.offset().left;
		$(flag).animate({left:'-=0' + x},3000, 'linear');
		$(flag).animate({width: '-=0' + flag.width()}, 1500, 'linear');
	}

	function movePuncher(){
		var belt = $('#belt');
		$('#glove').animate({top: '+=0' + belt.height()/3.0}, 
								(1000/ $("#glove").position().left),'linear', function() {
										Audio.play('punch_sound');});
		$('#glove').animate({top: '-=0' + belt.height()/3.0}, 600,'linear');
	}

	function clearTable(){
		$(".upperrow").remove();
		$(".checkmarks").remove();
		$(".flags").remove();
	}
	*/

	return my;              
}(jQuery));
