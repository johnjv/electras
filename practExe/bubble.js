var escaped, score, hit;
$(document).ready(function () {
	escaped = 0;
	hit = 0;
	//score = 0;
	function updateBubbles() {
		var bubble, body, x;

		if (Math.random() < 0.05) {
			bubble = $('<img src="bubble.png"></img>');
			bubble.width(24);
			body = $('body');
			x = Math.floor((body.width() - 24) * Math.random());
			bubble.offset({left: x, top: body.height()});
			body.append(bubble);
		}	

		$('img').each(function () {
			var pos;
			bubble = $(this);
			pos = bubble.offset();
			pos.top -= 2;
			if (pos.top + bubble.height() < 0) {
				bubble.remove();
				escaped = escaped - 1;
				score = escaped + hit;
				$('p').text('Score: ' + score);
			} else {
				bubble.offset(pos);
			}
		});
			$('img').each(function() {
			var bubble;
			bubble = $(this);
			bubble.click(function (){
				bubble.remove();
				hit = hit + 1;
				//console.log('hit: ' + hit + ' escaped: ' + escaped);
				score = escaped + hit;
				$('p').text('Score: ' + score);
				});
		});
	}
	setInterval(updateBubbles, 50);
});
