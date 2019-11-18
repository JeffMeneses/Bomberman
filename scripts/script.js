(function ()
{
    // Variáveis
    var cnv = document.querySelector("canvas");
    var ctx = cnv.getContext("2d");
    
    // Teclas
    var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40, Z = 90;

    // Movimentos
    var mvLeft = mvUp = mvRight = mvDown = bombFlag = false;

    // Imagens

    var imgWall = new Image();
    var imgFixedWall = new Image();
    var imgGrass = new Image();
    var imgBomberman = new Image();

    imgGrass.src = "imgs/wall.png";
    imgFixedWall.src = "imgs/fixedWall.png"
    imgWall.src = "imgs/grass.png";
    imgBomberman.src = "imgs/bomberman.png"

    var sprites = [];
    var walls = [];
    var fixedWalls = [];
    var bombs = [];
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
    var player = new Character(0, 0, 50, 50, "#c3b831");
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
        }
        else if(mvRight && !mvLeft)
        {
            player.posX += player.speed;
        }

        if(mvUp && !mvDown)
        {
            player.posY -= player.speed;
        }
        else if(mvDown && !mvUp)
        {
            player.posY += player.speed;
        }

        if(bombFlag)
        {
            var bomb = new Bomb(player.posX, player.posY, 40, 40);
            bombs.push(bomb);
            bombFlag = false;
        }

        player.posX = Math.max(0, Math.min(cnv.width - player.posX, player.posX));
        player.posY = Math.max(0, Math.min(cnv.height - player.posY, player.posY));


        for (var i in bombs)
        {
            var bomb = bombs[i];

            if(bomb.tempo)
            {
                bomb.tempo -= 1;
            }  
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
                ctx.fillStyle = "#01005a";
                ctx.fillRect(bomb.posX, bomb.posY, bomb.width, bomb.height);
            }  
        }

        for (var i in sprites)
        {
            spr = sprites[i];
            
            ctx.drawImage(
                imgBomberman, 
                spr.posX, spr.posY, 50, 50
            );
        }

        
        
        

    }

}());