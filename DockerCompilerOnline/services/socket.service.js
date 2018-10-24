module.exports = function(io){
  return{
    connect : function(){
      console.log('iske andar');
      io.on('connection', function(socket){
        // connections.push(socket);
        // console.log('Connected %s sockets connected', connections.length);
        console.log('connected');
      });
    }
  }

}
