//const Sprite = require('./Sprite')

class Bomb
{
    constructor(posX, posY, width, height, color)
    {
		this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;
        this.color = color;
		this.visible = true;
        this.tempo = 120;
    }
	
	bombPosition(tamanho, x, y)
	{
		var auxX = x;
		var auxY = y;
		var casaDestX;
		var casaDestY;
		
		
		casaDestY = ((Math.floor(auxY/tamanho) * tamanho) + tamanho/2) - 20;
		this.posY = casaDestY;

		
		casaDestX = ((Math.floor(auxX/tamanho) * tamanho) + tamanho/2) - 20;
		this.posX = casaDestX;			
		
	}
}

module.exports = Bomb;