(function ()
{
    // Client
    let connected = false;
    //const socket = io();
    let sessionID;
    const socket = io()
    let game;
    let totalPlayersCount = '';

    socket.on('connect', () => {
        sessionID = socket.id;
        connected = true
        console.log('> Connected to server')
    })

    socket.on('disconnect', () => {
        console.log('> Disconnected')
        connected = false
    })

    // INICIANDO GAME
    socket.on('boot', function(gameInicialState)
    {
        game = gameInicialState;
        console.log('> Received inicial state');

    })

    // FIM INICIANDO GAME

    socket.on('player-update', (player) => {
        if(connected)
        game.players[player.socketId] = player.newState;
    })


    

    // Variáveis
    var cnv = document.querySelector("canvas");
    cnv.style.width = "80vmin";
    var ctx = cnv.getContext("2d");
    
    // Teclas
    var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40, Z = 90;

    // Movimentos
    var mvLeft = mvUp = mvRight = mvDown = bombFlag = false;
	var primeiraVez = 0;

    // Imagens

    var imgWall = new Image();
    var imgFixedWall = new Image();
    var imgGrass = new Image();
    var imgBomberman = new Image();
	var imgBomb = new Image();

    imgGrass.src = "wall.png";
    imgFixedWall.src = "fixedWall.png"
    imgWall.src = "grass.png";
    imgBomberman.src = "Player1V3.png"
	imgBomb.src = "bomb.png";

    var sprites = [];
    var walls = [];
    var fixedWalls = [];
    var bombs = [];
    var tileSize = 50;

    imgWall.addEventListener("load", function(){
        requestAnimationFrame(loop, cnv);
    },false);


    

    var map =   [
                [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], 
                [0, 2, 0, 2, 1, 2, 1, 2, 0, 2, 1, 2, 0], 
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
                [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 0, 2, 1], 
                [1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1], 
                [1, 2, 0, 2, 1, 2, 0, 2, 0, 2, 1, 2, 1], 
                [1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0], 
                [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1], 
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
                [0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 2, 0], 
                [0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0]
                ];

    for (var i in map)
    {
        for (var j in map[i])
        {
            var tile = map[i][j];

            if(tile === 1) // Wall
            {
                var x = j * tileSize;
                var y = i * tileSize;

                var wall = new Wall(x, y, tileSize, tileSize, "#7a1672");
                walls.push(wall);
            }
            else if(tile === 2) // FixedWall
            {
                var x = j * tileSize;
                var y = i * tileSize;

                var fixedWall = new FixedWall(x, y, tileSize, tileSize, "#01005a");
                fixedWalls.push(fixedWall);
            }
        }
    }

    // Criação de sprites
    //var player = new Character(0, 0, 50, 50, "#c3b831", 0, 0);
    //sprites.push(player);

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

    window.addEventListener("keydown", keydownHandler, false);
    window.addEventListener("keyup", keyupHandler, false);

    function keydownHandler(e)
    {
        var key = e.keyCode;

        switch(key)
        {
            case LEFT:
                mvLeft = true;
                break;
            case UP:
                mvUp = true;
                break;
            case RIGHT:
                mvRight = true;
                break;
            case DOWN:
                mvDown = true;
                break;

            case Z:
                bombFlag = true;
                break;
        }
    }

    function keyupHandler(e)
    {
        var key = e.keyCode;

        switch(key)
        {
            case LEFT:
                mvLeft = false;
                break;
            case UP:
                mvUp = false;
                break;
            case RIGHT:
                mvRight = false;
                break;
            case DOWN:
                mvDown = false;
                break;

            case Z:
                bombFlag = false;
                break;
        }
    }


    function loop()
    {
        window.requestAnimationFrame(loop, cnv);
        update();
        render();

    }

    function update()
    {
        if(mvLeft && !mvRight)
        {
            game.players[sessionID].posX -= game.players[sessionID].speed;
            game.players[sessionID].srcY = 100;
            socket.emit('player-move', 'left', walls, fixedWalls);
        }
        else if(mvRight && !mvLeft)
        {
            game.players[sessionID].posX += game.players[sessionID].speed;
            game.players[sessionID].srcY = 34;
            socket.emit('player-move', 'right', walls, fixedWalls);
        }

        if(mvUp && !mvDown)
        {
            game.players[sessionID].posY -= game.players[sessionID].speed;
            game.players[sessionID].srcY = 66;
            socket.emit('player-move', 'up', walls, fixedWalls);
        }
        else if(mvDown && !mvUp)
        {
            game.players[sessionID].posY += game.players[sessionID].speed;
            game.players[sessionID].srcY = 0;
            socket.emit('player-move', 'down', walls, fixedWalls);
        }

        if((mvLeft || mvRight || mvUp || mvDown))
        {
            game.players[sessionID].countAnimation++;

            if(game.players[sessionID].countAnimation >= 40)
                game.players[sessionID].countAnimation = 0;
            game.players[sessionID].srcX = Math.floor(game.players[sessionID].countAnimation/5) * 20;
        }
        else
        {   
            game.players[sessionID].srcY = 0;
            game.players[sessionID].srcX = 0;
            game.players[sessionID].countAnimation = 0;
            socket.emit('player-move', 'noMove', walls, fixedWalls);
        }

        if(bombFlag)
        {
            var bomb = new Bomb(game.players[sessionID].posX, game.players[sessionID].posY, 40, 40);
			bomb.bombPosition(tileSize,game.players[sessionID].posX, game.players[sessionID].posY);
            bombs.push(bomb);
            bombFlag = false;
        }

        game.players[sessionID].posX = Math.max(0, Math.min(cnv.width - game.players[sessionID].width, game.players[sessionID].posX));
        game.players[sessionID].posY = Math.max(0, Math.min(cnv.height - game.players[sessionID].height, game.players[sessionID].posY));


        for (var i in bombs)
        {
            var bomb = bombs[i];

            if (colisaoBomba(bomb, game.players[sessionID])== 0)
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

        for(var i in walls)
        {
            var wall = walls[i];

            if(wall.visible)
            {
                block(game.players[sessionID], wall);
            }
                
        }

        for(var i in fixedWalls)
        {
            var fixedWall = fixedWalls[i];
            block(game.players[sessionID], fixedWall);   
        }
		primeiraVez++;
    }

    function render()
    {
        ctx.clearRect(0, 0, cnv.width, cnv.height);

        for (var i in map)
        {
            for (var j in map[i])
            {
               var tile = map[i][j];

                if(tile === 0)
                {
                    var x = j * tileSize;
                    var y = i * tileSize;

                    ctx.drawImage(
                        imgWall, 
                        x, y
                    );
                }

               if(tile === 1) // Wall
               {
                    var x = j * tileSize;
                    var y = i * tileSize;

                    ctx.drawImage(
                        imgGrass, 
                        x, y
                    );
               }
               else if(tile === 2) // FixedWall
               {
                    var x = j * tileSize;
                    var y = i * tileSize;

                    ctx.drawImage(
                        imgFixedWall, 
                        x, y
                    );
               }
            }
        }

// bomba

        for (var i in bombs)
        {
            var bomb = bombs[i];

            if(bomb.tempo)
            {
                /*ctx.drawImage(
						imgBomb, 
						bomb.posX, bomb.posY, 33, 50
                ); // printa bomba*/
                ctx.fillRect(bomb.posX, bomb.posY, bomb.width, bomb.height);
            }  
        }

        var index = 0;
        for (var i in game.players)
        {
            spr = game.players[i];
                ctx.drawImage(
                    imgBomberman, 
                    spr.srcX, spr.srcY, 22, 32, spr.posX, spr.posY, 50, 50
                );
            index++;
        }

	}
	
	function colisaoBomba(bomb, player)
	{

        console.log("Bomba[posX] = "+bomb.posX+"  Bomba[posY] = "+bomb.posY);
				
		var casaDestYOLD = ((Math.floor(player.posY/tileSize) * tileSize) + tileSize/2) - 20;		
        var casaDestXOLD = ((Math.floor(player.posX/tileSize) * tileSize) + tileSize/2) - 20;

        var DistX = Math.abs((bomb.posX + bomb.width/2) - (player.posX + player.width/2));
        var DistY = Math.abs((bomb.posY + bomb.height/2) - (player.posY + game.players[sessionID].height/2));
        
        //console.log("DistX = "+casaDestX+"  DistY = "+casaDestY);
        
        if((DistX > (bomb.width)) || (DistY > (bomb.height)))
        {
            block(game.players[sessionID], bomb);
        }
        
        return 1;
		
		
		
	}
        

    

}());