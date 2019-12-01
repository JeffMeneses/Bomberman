const express = require('express')
const webApp = express()
const webServer = require('http').createServer(webApp)
const io = require('socket.io')(webServer)

let game = createGame();
let maxConcurrentConnections = 4;

const Character = require('./Character');
const Bomb = require('./Bomb');

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
    
    socket.on('player-move', (direction, walls, fixedWalls, bombs) => {
      game.movePlayer(socket.id, direction, walls, fixedWalls, bombs)
  
      socket.broadcast.emit('player-update', {
        socketId: socket.id,
        newState: game.players[socket.id]
      })
    })

    socket.on('set-bomb', (bombs, tileSize) =>{
      const bomb = game.setBomb(socket.id, bombs, tileSize)
      socket.broadcast.emit('bomb-update', bomb)
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
    bombs: [],
    addPlayer,
    removePlayer,
    movePlayer,
    block,
    setBomb,
    colisaoBomba,
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

  function movePlayer(socketId, direction, walls, fixedWalls, bombs) {
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
    

//
    for (var i in bombs)
    {
      var bomb = bombs[i];

      if (colisaoBomba(bomb, player)== 0)
      {
        if(bomb.tempo == 0)
        {
          console.log("O Jogador Morreu!");
          break;
        }
      }

      if(bomb.tempo)
      {
        bomb.tempo -= 1;
      } 
      else
      {
        bombs.splice(i,1);
      }
    }
// 
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

  function colisaoBomba(bomb, player)
	{
      const tileSize = 50;
				
		    var casaDestYOLD = ((Math.floor(player.posY/tileSize) * tileSize) + tileSize/2) - 20;		
        var casaDestXOLD = ((Math.floor(player.posX/tileSize) * tileSize) + tileSize/2) - 20;

        var DistX = Math.abs((bomb.posX + bomb.width/2) - (player.posX + player.width/2));
        var DistY = Math.abs((bomb.posY + bomb.height/2) - (player.posY + player.height/2));
        
        if((DistX > (bomb.width)) || (DistY > (bomb.height)))
        {
            block(player, bomb);
        }
        
        return 1;

	}

  function setBomb(socketId, bombs, tileSize) {
    const player = game.players[socketId]

    var bomb = new Bomb(player.posX, player.posY, 40, 40, 'red');
    bomb.bombPosition(tileSize, player.posX, player.posY);
    //bombs.push(bomb);

    return bomb;
  }


  return game;
}