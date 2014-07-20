function lg(s) { console.log(s); }

$(function() {
	var
		DURATION = 150,
		CSS_CLOSE = {backgroundPosition:'0px'},
		$playlists = $('#body .playlists'),
		NList_nbVideos = $playlists[0].getElementsByTagName('em');

	function nbVideos() {
		$.each(NList_nbVideos, function() {
			this.textContent = this.parentNode.parentNode.getElementsByTagName('b').length;
		});
	}

	nbVideos();

	$('.playlist .edit', $playlists)
		.click(function() {
			$(this.parentNode.parentNode).toggleClass('edit');
		});

	$playlists
		.dragndrop({
			duration: DURATION,
			ondrag: function(drops, drags) {
				nbVideos();
			},
			ondrop: function(drop, drags) {
				nbVideos();
			},
			ondragover: function(l, r) {
				var $l = $(l),
					$r = $(r);
				$l.stop().animate({backgroundPosition: $l.width() * -0.1 + 'px'}, DURATION, 'swing');
				$r.stop().animate({backgroundPosition: $r.width() *  0.5 + 'px'}, DURATION, 'swing');
			},
			ondragout: function(l, r) {
				$(l).stop().animate(CSS_CLOSE, DURATION, 'swing');
				$(r).stop().animate(CSS_CLOSE, DURATION, 'swing');
			},
			ondropover: function(drop) {
				$(drop.parentNode).addClass('hover');
			},
			ondropout: function(drop) {
				$(drop.parentNode).removeClass('hover');
			}
		});
});

/*
	// La methode .delete qui se trouvait dans le plugin au debut:
	// case 46: self.delete(); break;
	delete: function() {
		var self = this,
			$drags = $(this.elemsSelected),
			i = 0;
		$drags
			.css('backgroundPosition', 'right')
			.animate({width: '0px'}, this.duration, 'swing', function() {
				if (++i === self.elemsSelected.length) {
					$drags.remove();
					self.elemsSelected.length = 0;
				}
			});
	},
*/
