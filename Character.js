class Sprite
{
    constructor(posX, posY, width, height, color)
    {
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;
        this.color = color;
        this.visible = true;
    }
}

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

module.exports = Character;