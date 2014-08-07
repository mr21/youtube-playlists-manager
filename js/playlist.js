ytplm.playlist = function(p) {

	lg('id          : ' + p.id)
	lg('title       : ' + p.snippet.title)
	lg('description : ' + p.snippet.description)
	lg('publishedAt : ' + p.snippet.publishedAt)
	lg('thumbnails  : ' + p.snippet.thumbnails.medium.url)

	this.jq_scope = $(
		'<div class="playlist">' +
			'<div class="header">' +
				'<div class="name">' +
					'<div class="relative">' +
						'<div class="absolute">' +
							'<a href="//youtube.com/playlist?list=' + p.id + '" target="_blank">' + p.snippet.title + '</a>' +
						'</div>' +
					'</div>' +
				'</div>' +
				'<div class="edit">' +
					'<a href="#"></a>' +
				'</div>' +
				'<em class="nbVideos"></em>' +
			'</div>' +
			'<div class="body">' +
				'<div class="bg" style="background-image:url(' + p.snippet.thumbnails.medium.url + ');"></div>' +
				'<div class="jqdnd-drop"></div>' +
				'<form>' +
					'<input type="text" value="" placeholder="Playlist\'s name"/><br/>' +
					'<input type="button" value="Cancel" class="cancel"/>' +
					'<input type="submit" value="Save"/><br/>' +
					'<input type="button" value="Delete" class="delete"/>' +
				'</form>' +
			'</div>' +
		'</div>'
	);

	var
		jq_scope = this.jq_scope,
		jq_aName = jq_scope.find('.name a'),
		jq_aEdit = jq_scope.find('.edit a'),
		jq_form = jq_scope.find('form'),
		jq_btnCancel = jq_form.find('.cancel'),
		jq_btnDelete = jq_form.find('.delete');

	jq_aEdit.click(function() {
		if (jq_scope.hasClass('edit')) {
			jq_scope.removeClass('edit');
		} else {
			jq_form[0][0].value = jq_aName[0].textContent;
			jq_scope.addClass('edit');
		}
		return false;
	});

	jq_btnCancel.click(function() {
		jq_scope.removeClass('edit');
	});

	jq_btnDelete.click(function() {
		;
	});

	jq_form.submit(function() {
		return false;
	});

};
