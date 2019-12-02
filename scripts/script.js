window.onload = function()
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
        connected = true;
        console.log('> Connected to server');
    })

    socket.on('disconnect', () => {
        console.log('> Disconnected')
        connected = false
    })

    socket.on('player-remove', (socketId) => {
        delete game.players[socketId]
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

    socket.on('bomb-update', (bomb) =>{
        if(connected)
        game.bombs.push(bomb)
        console.log("> the bomb has been set")
        console.log(bomb);
        console.log(game.bombs[0]);
    })

    socket.on('fire-update', (fire) =>{
        if(connected)
        game.fires.push(fire)
        console.log("> the fire has been set")
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
    var imgFogo = new Image();

    imgGrass.src = "grass.png";
    imgFixedWall.src = "fixedWall.png"
    imgWall.src = "wall.png";
    imgBomberman.src = "Player1V3.png"
    imgBomb.src = "bomb.png";
    imgFogo.src = "fogo.png";

    var sprites = [];
    var walls = [];
    var fixedWalls = [];
    var bombs = [];
    var grasses = [];
	var fires = [];
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
            else if(tile == 0) //Grass
			{
				var x = j * tileSize;
                var y = i * tileSize;

                var grass = new Grass(x, y, tileSize, tileSize, "#01005a");
                grasses.push(grass);
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

    window.querySelector(".leftButton").addEventListener("touchstart", touchStartHandler, false);
    window.querySelector(".leftButton").addEventListener("touchend", touchEndHandler, false);

    function touchStartHandler(e)
    {
        alert("toquei");
    }

    function touchEndHandler(e)
    {
        alert("destoquei");
    }

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
        if(connected)
        {
            window.requestAnimationFrame(loop, cnv);
            update();
            render();
        }
    }

    function update()
    {
        if(mvLeft && !mvRight)
        {
            game.players[sessionID].posX -= game.players[sessionID].speed;
            game.players[sessionID].srcY = 100;
            socket.emit('player-move', 'left', walls, fixedWalls, game.bombs);
        }
        else if(mvRight && !mvLeft)
        {
            game.players[sessionID].posX += game.players[sessionID].speed;
            game.players[sessionID].srcY = 34;
            socket.emit('player-move', 'right', walls, fixedWalls, game.bombs);
        }

        if(mvUp && !mvDown)
        {
            game.players[sessionID].posY -= game.players[sessionID].speed;
            game.players[sessionID].srcY = 66;
            socket.emit('player-move', 'up', walls, fixedWalls, game.bombs);
        }
        else if(mvDown && !mvUp)
        {
            game.players[sessionID].posY += game.players[sessionID].speed;
            game.players[sessionID].srcY = 0;
            socket.emit('player-move', 'down', walls, fixedWalls, game.bombs);
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
            socket.emit('player-move', 'noMove', walls, fixedWalls, game.bombs);
        }

        if(bombFlag)
        {
            var bomb = new Bomb(game.players[sessionID].posX, game.players[sessionID].posY, 40, 40, 'red');
			bomb.bombPosition(tileSize,game.players[sessionID].posX, game.players[sessionID].posY);
            game.bombs.push(bomb);
            bombFlag = false;
            socket.emit('set-bomb', game.bombs, tileSize);
        }

        game.players[sessionID].posX = Math.max(0, Math.min(cnv.width - game.players[sessionID].width, game.players[sessionID].posX));
        game.players[sessionID].posY = Math.max(0, Math.min(cnv.height - game.players[sessionID].height, game.players[sessionID].posY));


        for (var i in game.bombs)
        {
            var bomb = game.bombs[i];

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
                verificacaoRaioExplosao(bomb, game.players[sessionID]);
                game.bombs.splice(i,1);
			}
        }

        for (var j in game.fires)
        {
			var fire = game.fires[j];			
						
			if(fire.time)
			{
				colisaoBomba(fire, game.players[sessionID]);
				fire.time -= 1;
			}
			else
				game.fires.splice(i,1);
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
		//primeiraVez++;
    }

    function render()
    {
        ctx.clearRect(0, 0, cnv.width, cnv.height);

        //grama

		for (var i in grasses)
        {
            var grass = grasses[i];
			
			ctx.drawImage(
				imgGrass, 
				grass.posX, grass.posY, 50,50
			);		
		}
		
//paredes fixas
		
		for (var i in fixedWalls)
        {
            var fw = fixedWalls[i];
			
			ctx.drawImage(
				imgFixedWall, 
				fw.posX, fw.posY, 50,50
			);		
		}

//paredes


		for (var i in walls)
        {
            var wall = walls[i];
			
			ctx.drawImage(
				imgWall, 
				wall.posX, wall.posY, 50,50
			);
			
		}



// bomba

        for (var i in game.bombs)
        {
            var bomb = game.bombs[i];
		
            if(bomb.tempo > 50)
            {
                ctx.drawImage(
						imgBomb, 
						bomb.posX, bomb.posY, 35, 40
                ); // printa bomba
				
				
            }  	
			else
			{
				ctx.drawImage(
						imgFogo, 
						bomb.posX, bomb.posY, 35, 40
                ); //printa fogo
			}
			
			
        }
		
//fogo
	
       for (var i in game.fires)
        {
            var fire = game.fires[i];
			
			if(fire.time)
			{
				ctx.drawImage(
						imgFogo, 
						fire.posX, fire.posY, 35, 40
                ); //printa fogo
			}
		}
		
		
//personagens
        for (var i in game.players)
        {
            spr = game.players[i];
            
            ctx.drawImage(
                imgBomberman, 
                spr.srcX, spr.srcY, 22, 32, spr.posX, spr.posY, 50, 50
            );
            //(img,sx,sy,swidth,sheight,x,y,width,height);
        }
        

	}
	
	function colisaoBomba(bomb, player)
	{

        var DistX = Math.abs((bomb.posX + bomb.width/2) - (player.posX + player.width/2));
        var DistY = Math.abs((bomb.posY + bomb.height/2) - (player.posY + game.players[sessionID].height/2));
        
        //console.log("DistX = "+DistX+"  DistY = "+DistY);
        
        if((DistX > (bomb.width)) || (DistY > (bomb.height)))
        {
            block(game.players[sessionID], bomb);
        }
        
        return 1;
		
		
		
    }
    
    function quadrante(posX, posY)
	{
		var Quad = {X: 0, Y: 0};

		Quad.Y = Math.floor(posX / tileSize);
		Quad.X = Math.floor(posY / tileSize);

		return Quad;
	}

	function verificacaoRaioExplosao(bomb, player)
	{
		var contRaio = 50;
		var auxWalls = 1;
		var auxFogo = 1;
		
		var fire = new Fire(bomb.posX, bomb.posY, tileSize, tileSize, "#01005a");
        game.fires.push(fire);		
        socket.emit('set-Fire', fire);

        var quadPlayer = quadrante(player.posX, player.posY);
        var quadFogo = quadrante(fire.posX, fire.posY);

        if (quadPlayer.X == quadFogo.X && quadPlayer.Y == quadFogo.Y)
        {
            player.visible = false;
            alert("Você Morreu :[");
        }
		
		while(contRaio <= bomb.raioExplosao)
		{
			for(var i in walls)
			{
				var wall = walls[i];
									
				if(wall.posX == bomb.posX + contRaio -5 && wall.posY == bomb.posY - 5)  //linha direita
				{
					for(var j in fixedWalls)
					{
						var fixedW = fixedWalls[j];
						
						if(fixedW.posX == wall.posX + 50 && fixedW.posY == wall.posY)
						{	
							auxWalls = 1;	
							break;							
						}
						else
							auxWalls = 0;
					}
					if (auxWalls == 0) 
					{					
						var grass = new Grass(wall.posX, wall.posY, tileSize, tileSize, "#01005a");
						grasses.push(grass);
					//	var fire = new Fire(wall.posX, wall.posY, tileSize, tileSize, "#01005a");
					//	game.fires.push(fire);
						//walls.splice(i,1);
						walls[i] = 0;
					}
				}
				else if(wall.posY == bomb.posY + contRaio -5 && wall.posX == bomb.posX - 5)  //coluna baixo
				{
					for(var j in fixedWalls)
					{
						var fixedW = fixedWalls[j];
						
						if(fixedW.posY == wall.posY - 50 && fixedW.posX == wall.posX)
						{	
							auxWalls = 1;
						//	console.log("entrei2");
							break;
						}
						else
							auxWalls = 0;
					}
					if (auxWalls == 0) 
					{					
						var grass = new Grass(wall.posX, wall.posY, tileSize, tileSize, "#01005a");
						grasses.push(grass);
					//	var fire = new Fire(wall.posX, wall.posY, tileSize, tileSize, "#01005a");
						//game.fires.push(fire);
						//walls.splice(i,1);
						walls[i] = 0;
					}
				}
				else if(wall.posY == bomb.posY - contRaio -5 && wall.posX == bomb.posX - 5)  //coluna cima
				{
					for(var j in fixedWalls)
					{
						var fixedW = fixedWalls[j];
						
						if(fixedW.posY == wall.posY + 50 && fixedW.posX == wall.posX)
						{	
							auxWalls = 1;
						//	console.log("entrei2");
							break;
						}
						else
							auxWalls = 0;
					}
					if (auxWalls == 0) 
					{					
						var grass = new Grass(wall.posX, wall.posY, tileSize, tileSize, "#01005a");
						grasses.push(grass);
					//	var fire = new Fire(wall.posX, wall.posY, tileSize, tileSize, "#01005a");
					//	game.fires.push(fire);
						//walls.splice(i,1);
						walls[i] = 0;
					}
				}
				else if(wall.posX == bomb.posX - contRaio -5 && wall.posY == bomb.posY - 5) //linha esquerda
				{
					for(var j in fixedWalls)
					{
						var fixedW = fixedWalls[j];
						
						if(fixedW.posX == wall.posX + 50 && fixedW.posY == wall.posY)
						{	
							auxWalls = 1;
						//	console.log("entrei2");
							break;
						}
						else
							auxWalls = 0;
					}
					if (auxWalls == 0) 
					{					
						var grass = new Grass(wall.posX, wall.posY, tileSize, tileSize, "#01005a");
						grasses.push(grass);
						//var fire = new Fire(wall.posX, wall.posY, tileSize, tileSize, "#01005a");
					//	game.fires.push(fire);
						//walls.splice(i,1);
						walls[i] = 0;
					}
				}
				auxWalls =1;
			}
	
			//printando os fogos no lugar correto
			
			for (var h in grasses)
			{
				var grass = grasses[h];
				
				if(grass.posX == bomb.posX + contRaio -5 && grass.posY == bomb.posY -5) //linha direita
				{
					for(var j in fixedWalls)
					{
						var fixedW = fixedWalls[j];
						
						
						if(fixedW.posX == (grass.posX+50) - contRaio && fixedW.posY == grass.posY)
						{
							auxFogo = 1;
							break;
						}
						else
						{
							auxFogo = 0;
						}
							
						
						
					}
					if(auxFogo == 0)
					{
						var fire = new Fire(bomb.posX + contRaio, bomb.posY, tileSize, tileSize, "#01005a");
                        game.fires.push(fire);
                        socket.emit('set-Fire', fire);

						var quadPlayer = quadrante(player.posX, player.posY);
							var quadFogo = quadrante(fire.posX, fire.posY);

                            if (quadPlayer.X == quadFogo.X && quadPlayer.Y == quadFogo.Y)
                            {
                                player.visible = false;
                                alert("Você Morreu :[");
                            }
					}
					
				}
	
				if(grass.posX == bomb.posX -5 && grass.posY == bomb.posY + contRaio -5) //coluna baixo
				{
					for(var j in fixedWalls)
					{
						var fixedW = fixedWalls[j];
						
						if(fixedW.posX == grass.posX && fixedW.posY == (grass.posY+50) - contRaio)
						{
							auxFogo = 1;
							break;
						}
						else
							auxFogo = 0;
						
						
					}
					if(auxFogo == 0)
						{
							var fire = new Fire(bomb.posX , bomb.posY + contRaio, tileSize, tileSize, "#01005a");
                            game.fires.push(fire);
                            socket.emit('set-Fire', fire)

							var quadPlayer = quadrante(player.posX, player.posY);
							var quadFogo = quadrante(fire.posX, fire.posY);

							if (quadPlayer.X == quadFogo.X && quadPlayer.Y == quadFogo.Y)
							{
                                player.visible = false;
                                alert("Você Morreu :[");
                            }
						}
				}

				else if((grass.posX == bomb.posX - contRaio -5 && grass.posY == bomb.posY -5)) //linha esquerda
				{
					for(var j in fixedWalls)
					{
						var fixedW = fixedWalls[j];
						
						if(fixedW.posX == (grass.posX+50) + contRaio && fixedW.posY == grass.posY)
						{
							auxFogo = 1;
							break;
						}
						else
							auxFogo = 0;
						
						
					}
					if(auxFogo == 0)
						{
							var fire = new Fire(bomb.posX - contRaio, bomb.posY, tileSize, tileSize, "#01005a");
                            game.fires.push(fire);	
                            socket.emit('set-Fire', fire)

							var quadPlayer = quadrante(player.posX, player.posY);
							var quadFogo = quadrante(fire.posX, fire.posY);

							if (quadPlayer.X == quadFogo.X && quadPlayer.Y == quadFogo.Y)
							{
                                player.visible = false;
                                alert("Você Morreu :[");
                            }
						}
				}

				else if(grass.posX == bomb.posX -5 && grass.posY == bomb.posY - contRaio -5) //coluna cima
				{
					for(var j in fixedWalls)
					{
						var fixedW = fixedWalls[j];
						
						if(fixedW.posX == grass.posX && fixedW.posY == (grass.posY+50) + contRaio)
						{
							auxFogo = 1;
							break;
						}
						else
							auxFogo = 0;
						
						
					}
					if(auxFogo == 0)
						{
							var fire = new Fire(bomb.posX, bomb.posY - contRaio, tileSize, tileSize, "#01005a");
                            game.fires.push(fire);
                            socket.emit('set-Fire', fire)

							var quadPlayer = quadrante(player.posX, player.posY);
							var quadFogo = quadrante(fire.posX, fire.posY);

							if (quadPlayer.X == quadFogo.X && quadPlayer.Y == quadFogo.Y)
							{
                                player.visible = false;
                                alert("Você Morreu :[");
                            }
						}
				}
				
				auxFogo = 1;
			}
			
			contRaio +=  50;
		}
	
	}
        

    

}