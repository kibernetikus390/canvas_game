import {c} from "../index.js";

const PLAYER_MAX_SPEED = 5;
const FRICTION_PLAYER = 0.9;

export default class Player{
    constructor(x,y,radius,color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = {x:0,y:0};
        this.powerUp = "none";
    }
    
    draw()
    {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, 360, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update()
    {
        //速度上限
        let Hypotenuse = Math.sqrt(this.velocity.x * this.velocity.x  + this.velocity.y * this.velocity.y);
        if(Hypotenuse > PLAYER_MAX_SPEED)
        {
            this.velocity.x = this.velocity.x / Hypotenuse * PLAYER_MAX_SPEED;
            this.velocity.y = this.velocity.y / Hypotenuse * PLAYER_MAX_SPEED;
        }

        //速度抵抗
        this.velocity.x *= FRICTION_PLAYER;
        this.velocity.y *= FRICTION_PLAYER;

        //境界制限
        if( this.x - this.radius + this.velocity.x >= 0 &&
            this.x + this.radius + this.velocity.x <= canvas.width)
        {
            this.x += this.velocity.x;
        }
        else
        {
            this.velocity.x = 0;
        }
        if( this.y - this.radius + this.velocity.y >= 0 &&
            this.y + this.radius + this.velocity.y <= canvas.height)
        {
            this.y += this.velocity.y;
        }
        else
        {
            this.velocity.y = 0;
        }

        //描画
        //this.draw();
    }
};