const express = require('express')
const webApp = express()
const webServer = require('http').createServer(webApp)
const io = require('socket.io')(webServer)

let game = createGame();
let maxConcurrentConnections = 4;

var Character = require('./Character');



webApp.use(express.static('./'));

webApp.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
})

io.on('connection', function(socket){
  console.log(io.engine.clientsCount);
  if(io.engine.clientsCount > maxConcurrentConnections)
  {
    //socket.emit('show-max-concurrent-connections-message');
    socket.conn.close();
    return;
  }

    const playerState = game.addPlayer(socket.id);
    socket.emit('boot', game)

    socket.broadcast.emit('player-update', {
      socketId: socket.id,
      newState: playerState
    })
    
    socket.on('player-move', (direction, walls, fixedWalls) => {
      game.movePlayer(socket.id, direction, walls, fixedWalls)
  
      socket.broadcast.emit('player-update', {
        socketId: socket.id,
        newState: game.players[socket.id]
      })
    })


    socket.on('disconnect', function()
    {
      game.removePlayer(socket.id);
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
    movePlayer,
    block,
  }

  function addPlayer(socketId) {

    console.log("Jogardor "+io.engine.clientsCount);
      switch(io.engine.clientsCount)
      {
        
        case 1: game.players[socketId] = new Character(0, 0, 50, 50, "#c3b831", 0, 0);
        break;
        case 2: game.players[socketId] = new Character(600, 0, 50, 50, "#c3b831", 0, 0);
        break;
        case 3: game.players[socketId] = new Character(0, 500, 50, 50, "#c3b831", 0, 0);
        break;
        case 4: game.players[socketId] = new Character(600, 500, 50, 50, "#c3b831", 0, 0);
        break;
      }

      console.log(game.players[socketId]);  
  }

  function removePlayer(socketId) {
    delete game.players[socketId]
  }

  function movePlayer(socketId, direction, walls, fixedWalls) {
    const player = game.players[socketId]

    if(direction === 'left')
    {
      player.posX -= player.speed;
      player.srcY = 100;
    }

    if(direction === 'right')
    {
      player.posX += player.speed;
      player.srcY = 34;
    }

    if(direction === 'up')
    {
      player.posY -= player.speed;
      player.srcY = 66;
    }

    if(direction === 'down')
    {
      player.posY += player.speed;
      player.srcY = 0;
    }
    
    if(direction === 'noMove')
    {
      player.srcY = 0;
      player.srcX = 0;
      player.countAnimation = 0;
    }

    if(direction)
    {
      player.countAnimation++;

      if(player.countAnimation >= 40)
          player.countAnimation = 0;
      player.srcX = Math.floor(player.countAnimation/5) * 20;
    }

    player.posX = Math.max(0, Math.min(650 - player.width, player.posX));
    player.posY = Math.max(0, Math.min(550 - player.height, player.posY));
    
    for(var i in walls)
    {
      var wall = walls[i];

      if(wall.visible)
      {
          block(player, wall);
      }            
    }

    for(var i in fixedWalls)
    {
        var fixedWall = fixedWalls[i];
        block(player, fixedWall);     
    }

    return player;
  }

  function block(objA, objB)
  {
      var distX = (objA.posX + objA.width/2) - (objB.posX + objB.width/2); // Distancia em X entre os centros
      var distY = (objA.posY + objA.height/2) - (objB.posY + objB.height/2); // Distancia em Y entre os centros

      var sumWidth = (objA.width + objB.width) / 2; // Soma das larguras
      var sumHeight = (objA.height + objB.height) / 2; // Soma das alturas

      if(Math.abs(distX) < sumWidth && Math.abs(distY) < sumHeight) // Houve colisão
      {
          var overlapX = sumWidth - Math.abs(distX);
          var overlapY = sumHeight - Math.abs(distY);

          if(overlapX > overlapY)
          {
              if(distY > 0)
                  objA.posY += overlapY;
              else 
                  objA.posY -= overlapY;
          }
          else
          {
              if(distX > 0)
                  objA.posX += overlapX;
              else 
                  objA.posX -= overlapX;
          }
      }
  }


  return game;
}