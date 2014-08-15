function GoogleAPI(elem, fn_success, fn_fail) {
	var jq_body = $(document.body),
		click_set,
		connected,
		api_id = {
			client_id: '514381834459-gr3dgmesev8jflg5364piutqb6alb35b.apps.googleusercontent.com',
			scope: ['https://www.googleapis.com/auth/youtube']
		};

	function elemText(status) {
		connected = status;
		jq_body
			.removeClass('connection-' + (!status)*1)
			.addClass('connection-' + status);
	}

	function click() {
		if (connected)
			logout();
		else
			login(false);
		return false;
	}

	function logout() {
		gapi.auth.signOut();
		elemText(0);
	}

	function login(now) {
		api_id.immediate = now;
		gapi.auth.authorize(api_id, function(authResult) {
			if (!click_set) {
				click_set = true;
				elemText(0);
				$(elem).click(click);
			}
			if (authResult.status.signed_in) {
				gapi.client.load('youtube', 'v3', function() {
					elemText(1);
					fn_success();
				});
			} else {
				elemText(0);
				fn_fail();
			}
		});
	}

	window.gapi_onload = function() {
		gapi.auth.init(function() {
			setTimeout(function() {
				login(true);
			}, 1);
		});
	}
}
