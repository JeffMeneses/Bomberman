class Fire extends Sprite
{
    constructor(posX, posY, width, height, color)
    {
        super(posX, posY, width, height, color);
		this.time = 100;
		this.raioExplosao = 150;
    }
}