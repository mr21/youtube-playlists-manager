function lg(s) { console.log(s); }

var
	DURATION = 150,
	CSS_CLOSE = {backgroundPosition:'0px'},
	$playlists_container = $('#body .playlists'),
	$playlists = $('.playlist', $playlists_container),
	NList_nbVideos = $playlists_container[0].getElementsByTagName('em');

GoogleAPI(
	$('#header .connection a')[0],
	function() {
		lg('success');
		gapi.client.youtube.playlists.list({
			part: 'snippet',
			maxResults: 50,
			mine: true
		}).execute(function(pl) {
			lg(pl);
		});
	},
	function() {
		lg('fail');
	}
);

function nbVideos() {
	$.each(NList_nbVideos, function() {
		this.textContent = this.parentNode.parentNode.getElementsByTagName('b').length;
	});
}

nbVideos();

$('.edit a', $playlists)
	.click(function() {
		var $pl = $(this.parentNode.parentNode.parentNode);
		if ($pl.hasClass('edit')) {
			$pl.removeClass('edit');
		} else {
			$pl[0].getElementsByTagName('form')[0][0].value =
				$pl.find('.name a')[0].textContent;
			$pl.addClass('edit');
		}
		return false;
	});

$('.cancel', $playlists)
	.click(function() {
		$(this.parentNode.parentNode.parentNode).removeClass('edit');
	});

$playlists_container
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
