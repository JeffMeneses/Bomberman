class Character extends Sprite
{
    constructor(posX, posY, width, height, color, srcX, srcY)
    {
        super(posX, posY, width, height, color, srcX, srcY);
        this.speed = 2;
        this.srcX = srcX;
        this.srcY = srcY;
        this.countAnimation = 0;
    }
}