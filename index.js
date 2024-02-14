const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const x = canvas.width/2;
const y = canvas.height/2;
const c = canvas.getContext("2d");

class Player{
    constructor(x,y,radius,color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    
    draw()
    {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, 360, false);
        c.fillStyle = this.color;
        c.fill();
    }
}

const player = new Player(x,y,30,"blue");
player.draw();

console.log(player);