const express = require('express')
const webApp = express()
const webServer = require('http').createServer(webApp)
const io = require('socket.io')(webServer)

let game = createGame();
let maxConcurrentConnections = 1;



webApp.use(express.static('./'));

webApp.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
})

io.on('connection', function(socket){
  if(io.engine.clientsCount > maxConcurrentConnections)
  {
    //socket.emit('show-max-concurrent-connections-message');
    socket.conn.close();
    return;
  }
  else{
    socket.emit('boot', game);
    socket.emit('add-player');
    socket.on('game-update',function(newGame)
    {
      game = newGame;
      //console.log(game.player[socket.id].posX);
    })
    console.log(io.engine.clientsCount);

    
  }

  socket.emit('alo-uhu');

  socket.on('disconnect', function()
  {
    //game.removePlayer(socket.id);
    socket.broadcast.emit('player-remove', socket.id);
  })

})

webServer.listen(3000, function(){
  console.log('> Server listening on port:',3000);
});


function createGame() {
  console.log('> Starting new game')

  let game = {
    //canvasWidth: 35,
    //canvasHeight: 30,
    players: {},
    addPlayer,
    removePlayer,
    //movePlayer,
  }

  function addPlayer(socketId) {
    

  }

  function removePlayer(socketId) {
    delete game.players[socketId]
  }

  /*function movePlayer(socketId, direction) {
    const player = game.players[socketId]

    return player;
  }*/
  return game;
}