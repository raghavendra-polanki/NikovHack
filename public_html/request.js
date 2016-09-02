function makeRequest() {
    var request = gapi.client.vision.images.annotate({
      "requests":
      [
        {
          "image":
          {
            "content": $('#photo').attr('src').replace("data:image/jpeg;base64,", "")
          },
          "features":
          [
            {
              "maxResults": 100,
              "type": "TEXT_DETECTION"
            }
          ]
        }
      ]
    });
    request.then(function(response) {
        sanitize(response);
        }, function(reason) {
            console.log('Error: ' + reason.result.error.message);
        }
    );
    // console.log("Loaded");
}

function init() {
    gapi.client.setApiKey('AIzaSyAPHpiTbAzrx8_BmyuitgkJpEvj8JibCJc');
    gapi.client.load('vision').then(makeRequest);
}

function hitAPI() { gapi.load('client', init); }
