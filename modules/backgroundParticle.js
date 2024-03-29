import {c} from "../index.js";
const BG_PARTICLE_ALPHA = 0.1;
export {BG_PARTICLE_ALPHA, BackgroundParticle};

class BackgroundParticle
{
    constructor({position, radius = 3, color = "gray"})
    {
        this.position = position;
        this.radius = radius;
        this.color = color;
        this.alpha = BG_PARTICLE_ALPHA/10;
    }
    draw()
    {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2);
        c.fillStyle = this.color;
        c.fill();
        c.restore();
    }
};