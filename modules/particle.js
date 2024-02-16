import {c,player} from "../index.js";
const FRICTION = 0.99;

export default class Particle{
    constructor(x,y,r,c,v)
    {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.color = c;
        this.velocity = v;
        this.alpha = Math.random()*2;
    }
    draw()
    {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, 360, false);
        c.fillStyle = this.color;
        c.fill();
        c.restore();
    }
    update()
    {
        this.draw();
        this.velocity.x = this.velocity.x * FRICTION;
        this.velocity.y = this.velocity.y * FRICTION;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.02;
    }
};