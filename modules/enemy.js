import {c,player} from "../index.js";
const SPIN_RADIUS = 30;
const SPIN_SPEED  = 0.1;

export default class Enemy{
    constructor(x,y,r,c,v)
    {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.color = c;
        this.velocity = v;
        this.radians = 0;
        this.center = {x:x,y:y};
        this.type = "liner";
        this.invert = (Math.random() < 0.5) ? false : true;
        if(Math.random() < 0.5){
            this.type = "homing";
            if(Math.random() < 0.5){
                this.type = "spinning";
                if(Math.random() < 0.5){
                    this.type = "spinning_homing";
                }
            }
        }
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
        if(this.type == "spinning")
        {
            this.radians = this.radians + ((this.invert) ? SPIN_SPEED : -SPIN_SPEED);
            this.center.x += this.velocity.x;
            this.center.y += this.velocity.y;
            this.x = this.center.x + Math.cos(this.radians) * SPIN_RADIUS;
            this.y = this.center.y + Math.sin(this.radians) * SPIN_RADIUS;
        }
        else if(this.type == "spinning_homing")
        {
            let angle = Math.atan2(player.y-this.y, player.x-this.x);
            this.radians = this.radians + ((this.invert) ? SPIN_SPEED : -SPIN_SPEED);
            this.center.x += Math.cos(angle);
            this.center.y += Math.sin(angle);
            this.x = this.center.x + Math.cos(this.radians) * SPIN_RADIUS;
            this.y = this.center.y + Math.sin(this.radians) * SPIN_RADIUS;
        }
        else if(this.type == "homing")
        {
            let angle = Math.atan2(player.y-this.y, player.x-this.x);
            this.velocity.x = Math.cos(angle);
            this.velocity.y = Math.sin(angle);
            this.x = this.x + this.velocity.x;
            this.y = this.y + this.velocity.y;   
        }
        else
        {
            this.x = this.x + this.velocity.x;
            this.y = this.y + this.velocity.y;   
        }
        this.draw();
    }
};