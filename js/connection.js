function GoogleAPI(elem, fn_success, fn_fail) {
	var click_set,
		connected,
		api_id = {
			client_id: '514381834459-gr3dgmesev8jflg5364piutqb6alb35b.apps.googleusercontent.com',
			scope: ['https://www.googleapis.com/auth/youtube']
		};

	function elemText(status) {
		connected = status;
		elem.textContent = status ? 'Log out' : 'Log in';
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
		elemText();
	}

	function login(now) {
		api_id.immediate = now;
		gapi.auth.authorize(api_id, function(authResult) {
			if (!click_set) {
				click_set = true;
				elemText();
				$(elem).click(click);
			}
			if (authResult.status.signed_in) {
				gapi.client.load('youtube', 'v3', function() {
					elemText(true);
					fn_success();
				});
			} else {
				elemText();
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
