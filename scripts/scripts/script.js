(function ()
{
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

    imgGrass.src = "imgs/grass.png";
    imgFixedWall.src = "imgs/fixedWall.png"
    imgWall.src = "imgs/wall.png";
    imgBomberman.src = "imgs/Player1V3.png"
	imgBomb.src = "imgs/bomb.png";
	imgFogo.src = "imgs/fogo.png";

    var sprites = [];
    var walls = [];
    var fixedWalls = [];
    var bombs = [];
	var grasses = [];
	var fires = [];
    var tileSize = 50;

    imgWall.addEventListener("load", function(){
        console.log(walls);
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
                [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], 
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
    var player = new Character(0, 0, 50, 50, "#c3b831", 0, 0);
    sprites.push(player);

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
            player.posX -= player.speed;
            sprites[0].srcY = 100;
        }
        else if(mvRight && !mvLeft)
        {
            player.posX += player.speed;
            sprites[0].srcY = 34;
        }

        if(mvUp && !mvDown)
        {
            player.posY -= player.speed;
            sprites[0].srcY = 66;
        }
        else if(mvDown && !mvUp)
        {
            player.posY += player.speed;
            sprites[0].srcY = 0;
        }

        if((mvLeft || mvRight || mvUp || mvDown))
        {
            player.countAnimation++;

            if(player.countAnimation >= 40)
                player.countAnimation = 0;
            player.srcX = Math.floor(player.countAnimation/5) * 20;
        }
        else
        {   
            sprites[0].srcY = 0;
            sprites[0].srcX = 0;
            player.countAnimation = 0;  
        }

        if(bombFlag && !mvLeft && !mvRight && !mvUp && !mvDown)
        {
            var bomb = new Bomb(player.posX, player.posY, 40, 40);
			bomb.bombPosition(tileSize,player.posX, player.posY);
            bombs.push(bomb);
            bombFlag = false;
        }

        player.posX = Math.max(0, Math.min(cnv.width - player.width, player.posX));
        player.posY = Math.max(0, Math.min(cnv.height - player.height, player.posY));


        for (var i in bombs)
        {
            var bomb = bombs[i];			
			
           if (colisaoBomba(bomb, player)== 0)
			{
				if(bomb.tempo ==0)
				{
					alert("VOCE MORREU!!!!");
					break;
				}
			}

            if(bomb.tempo)
            {
                bomb.tempo -= 1;
				
            } 
			else
			{
				verificacaoRaioExplosao(bomb, player);
				bombs.splice(i,1);
			}
        }
		
		for (var j in fires)
        {
			var fire = fires[j];			
						
			if(fire.time)
			{
				fire.time -= 1;
			}
			else
				fires.splice(i,1);
		}
		

        for(var i in walls)
        {
            var wall = walls[i];

            if(wall.visible)
                block(player, wall);
				
        }

        for(var i in fixedWalls)
        {
            var fixedWall = fixedWalls[i];
            block(player, fixedWall);
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

        for (var i in bombs)
        {
            var bomb = bombs[i];
		
            if(bomb.tempo > 20)
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
	
       for (var i in fires)
        {
            var fire = fires[i];
			
			if(fire.time)
			{
				ctx.drawImage(
						imgFogo, 
						fire.posX, fire.posY, 35, 40
                ); //printa fogo
			}
		}
		
		
//personagens
        for (var i in sprites)
        {
            spr = sprites[i];
            
            ctx.drawImage(
                imgBomberman, 
                spr.srcX, spr.srcY, 22, 32, spr.posX, spr.posY, 50, 50
            );
            //(img,sx,sy,swidth,sheight,x,y,width,height);
        }
			
		

	}
	
	
	
	function colisaoBomba(bomb, player)
	{
        				
		var casaDestYOLD = ((Math.floor(player.posY/tileSize) * tileSize) + tileSize/2) - 20;		
        var casaDestXOLD = ((Math.floor(player.posX/tileSize) * tileSize) + tileSize/2) - 20;

        var DistX = Math.abs((bomb.posX + bomb.width/2) - (player.posX + player.width/2));
        var DistY = Math.abs((bomb.posY + bomb.height/2) - (player.posY + player.height/2));      
        
        if((DistX > (bomb.width)) || (DistY > (bomb.height)))
        {
            block(player, bomb);
			return 1;
        }
        
        return 0;		
		
		
	}
	
	function verificacaoRaioExplosao(bomb, player)
	{
		var contRaio = 50;
		var auxWalls = 1;
		var auxFogo = 1;
		
		var fire = new Fire(bomb.posX, bomb.posY, tileSize, tileSize, "#01005a");
		fires.push(fire);		
		
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
							break;
						}
						else
							auxWalls = 0;
					}
					if (auxWalls == 0) 
					{					
						var grass = new Grass(wall.posX, wall.posY, tileSize, tileSize, "#01005a");
						grasses.push(grass);
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
							break;
						}
						else
							auxWalls = 0;
					}
					if (auxWalls == 0) 
					{					
						var grass = new Grass(wall.posX, wall.posY, tileSize, tileSize, "#01005a");
						grasses.push(grass);
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
							break;
						}
						else
							auxWalls = 0;
					}
					if (auxWalls == 0) 
					{					
						var grass = new Grass(wall.posX, wall.posY, tileSize, tileSize, "#01005a");
						grasses.push(grass);
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
						console.log('x');
						var fire = new Fire(bomb.posX + contRaio, bomb.posY, tileSize, tileSize, "#01005a");
						console.log(fire);
						fires.push(fire);
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
							fires.push(fire);
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
							fires.push(fire);	
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
							fires.push(fire);
						}
				}
				
				auxFogo = 1;
			}
			
			contRaio +=  50;
		}
	
	}			
		
		

	
        
        

    

}());