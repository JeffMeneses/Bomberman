class Bomb extends Sprite
{
    constructor(posX, posY, width, height, color)
    {
        super(posX, posY, width, height, color);
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