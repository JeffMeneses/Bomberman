class Fire
{
    constructor(posX, posY, width, height, color)
    {
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;
        this.color = color;
        this.visible = true;

		this.time = 100;
		this.raioExplosao = 150;
    }
}