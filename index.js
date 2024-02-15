const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const x = canvas.width/2;
const y = canvas.height/2;
const c = canvas.getContext("2d");
const PROJ_SPEED = 3;
const HIT_RANGE = 0.5;

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
class Enemy{
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
const enemies = [];

function spawnEnemy()
{
    setInterval(()=>{
        let radius = Math.random() * (30 - 4) + 4;
        
        let x,y;
        
        if(Math.random()<0.5)
        {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        }
        else
        {
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
            x = Math.random() * canvas.width;
        }
        
        let color = "green";
        let angle = Math.atan2(canvas.height/2 - y, canvas.width/2 - x);
        let velocity = {
            x:Math.cos(angle),
            y:Math.sin(angle)
        };
        enemies.push(new Enemy(x,y,radius,color,velocity));
    },1000)
}

let animationId;
function animate()
{
    animationId = window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    projectiles.forEach(p => {
       p.update(); 
    });
    enemies.forEach((e,eIndex)=>{
        e.update();
        let dist = Math.hypot(player.x-e.x, player.y-e.y);
        if(dist - e.radius - player.radius < HIT_RANGE)
        {
            window.cancelAnimationFrame(animationId);
        }
        projectiles.forEach((p,pIndex)=>{
            let dist = Math.hypot(p.x-e.x, p.y-e.y)
            if(dist - e.radius - p.radius< HIT_RANGE)
            {
                //ちらつきを防ぐため、次のフレームまで削除を待つ
                setTimeout(()=>{
                   enemies.splice(eIndex,1);
                   projectiles.splice(pIndex,1);
                }, 0);
            }
        });
    });
}

window.addEventListener("click",(event)=>{
    let angle = Math.atan2(event.clientY - y, event.clientX - x);
    let velocity = {
        x:Math.cos(angle)*PROJ_SPEED,
        y:Math.sin(angle)*PROJ_SPEED
    };
    projectiles.push(new Projectile(
        canvas.width / 2,
        canvas.height / 2,
        5, "red", velocity));
});

animate();
spawnEnemy();