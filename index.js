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
};

class Projectile{
    constructor(x,y,r,c,v)
    {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.color = c;
        this.velocity = v;
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
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;   
    }
};

const player = new Player(x,y,30,"blue");
player.draw();

const projectiles = [];


function animate()
{
    window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    projectiles.forEach(p => {
       p.update(); 
    });
    
}

window.addEventListener("click",(event)=>{
    let angle = Math.atan2(event.clientY - y, event.clientX - x);
    let velocity = {
        x:Math.cos(angle),
        y:Math.sin(angle)
    };
    projectiles.push(new Projectile(
        canvas.width / 2,
        canvas.height / 2,
        5, "red", velocity));
});


animate();
console.log(player);