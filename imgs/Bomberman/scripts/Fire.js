class Fire extends Sprite
{
    constructor(posX, posY, width, height, color)
    {
        super(posX, posY, width, height, color);
		this.time = 60;
		this.raioExplosao = 150;
    }
}