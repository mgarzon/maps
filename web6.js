var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var d3   = require('d3');
var fs = require('fs');
//var Syslogd = require('syslogd')
//var syslogParser = require('glossy').Parse; // or wherever your glossy libs are
var dgram  = require("dgram");
var server = dgram.createSocket("udp4");

app.use(express.static('public'));

server.on("message", function(rawMessage) {
  //  syslogParser.parse(rawMessage.toString('utf8', 0), function(parsedMessage){
     
	var parsedmessage = rawMessage;


		
		//	regex
		
		var regip = /(\w*[.]\w*[.]\w*[.]\w*)/.exec(parsedmessage);
		//console.log(regip[1]);
		if (regip != null && regip[1] != "0.0.0.0") {

		regip.forEach(function(ip){


				console.log("Found IP " + ip);
				messageIP = ip
				
				//regex end
				
				
					
				//geolocate
				
				var request = require("request")

				var url = "http://api.ipinfodb.com/v3/ip-city/?key=6309d1e54af3ac465122d736a678351f56670c4e666a6345f8b88eaed8e315cb&ip=" + messageIP +  "&format=json"
				//console.log (url);
				
				request({
					url: url,
					json: true
				}, function (error, response, body) {

						if (!error && response.statusCode === 200) {
							   // console.log(body) // Print the json response
								
								var iplatitude = body.latitude
								var iplongitude = body.longitude
								
								//build an arc array with FB Destination
								
								var ipdestination = {origin: {latitude: +iplatitude, longitude: +iplongitude}, destination: {
										latitude: 37.6688,
										longitude: -122.0808 }, options: {strokeWidth:3 , strokeColor: 'rgba(255, 0, 0, 0.4)', greatArc: true, animationSpeed: 600}}
								
								//console.log(ipdestination)
								//Send it
								io.emit('message', {'message': body, for: 'everyone'});
			
						
						}
				})

				)};
		
		} else {console.log("nothing")};

  //  });
});




server.on("listening", function() {
    var address = server.address();
    console.log("Server now listening at " + 
        address.address + ":" + address.port);
});

server.bind(514); // Remember ports < 1024 need suid


http.listen(3000);








