app.factory('socket',function(socketFactory,PARAMS){

 	var myIoSocket = io.connect(PARAMS.SERVER_URL);

  	mySocket = socketFactory({
    	ioSocket: myIoSocket
  	});
  	
	return mySocket;
});