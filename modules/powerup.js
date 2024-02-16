import {c} from "../index.js";
export {POWERUP_SPEED, PowerUp};

const POWERUP_SPEED = .5;
class PowerUp{
    constructor(position, velocity)
    {
        this.position = position;
        this.velocity = velocity;
        this.image = new Image();
        this.image.src = "./img/lightningBolt.png";
        this.alpha = 1;
        this.radians = 0;
        gsap.to(this,{alpha:0, duration:0.3, repeat:-1, yoyo:true, ease:"linear"})
        
        let Hypotenuse = Math.sqrt(this.velocity.x * this.velocity.x  + this.velocity.y * this.velocity.y);
        this.velocity.x = this.velocity.x / Hypotenuse * POWERUP_SPEED;
        this.velocity.y = this.velocity.y / Hypotenuse * POWERUP_SPEED;
    }
    draw()
    {
        c.save();
        c.globalAlpha = this.alpha;
        c.translate(
            this.position.x + this.image.width / 2,
            this.position.y + this.image.height / 2
        );
        c.rotate(this.radians);
        c.translate(
            -this.position.x - this.image.width / 2,
            -this.position.y - this.image.height / 2
        );
        c.drawImage(this.image, this.position.x,this. position.y);
        c.restore();
    }
    update()
    {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        //this.radians += 0.01;    
        this.draw();
    }
};