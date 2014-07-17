var playlistId, channelId;

// After the API loads, call a function to enable the playlist creation form.
function handleAPILoaded() {
  enableForm();
}

function enableForm() {
  $('#playlist-button').attr('disabled', false);
}

function createPlaylist() {
  lg('createPlaylist()')
  var request = gapi.client.youtube.playlists.insert({
    part: 'snippet,status',
    resource: {
      snippet: {
        title: 'Test Playlist',
        description: 'A private playlist created with the YouTube API'
      },
      status: {
        privacyStatus: 'private'
      }
    }
  });
  request.execute(function(response) {
    var result = response.result;
    lg(' > response:'); lg(response); lg('');
    if (result) {
      playlistId = result.id;
      $('#playlist-id').val(playlistId);
      $('#playlist-title').html(result.snippet.title);
      $('#playlist-description').html(result.snippet.description);
    } else {
      $('#status').html('Could not create playlist');
    }
  });
}

// Add a video ID specified in the form to the playlist.
function addVideoToPlaylist() {
  addToPlaylist($('#video-id').val());
}

function addToPlaylist(id, startAt, endAt) {
  var details = {
    kind: 'youtube#video',
    videoId: id
  }
  if (startAt !== undefined) details.startAt = startAt;
  if (endAt   !== undefined) details.endAt   = endAt;
  var request = gapi.client.youtube.playlistItems.insert({
    part: 'snippet',
    resource: {
      snippet: {
        playlistId: playlistId,
        resourceId: details
      }
    }
  });
  request.execute(function(response) {
    $('#status').html('<pre>' + JSON.stringify(response.result) + '</pre>');
  });
}
