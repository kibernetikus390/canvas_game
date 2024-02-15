const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const scoreEl = document.querySelector("#scoreText");
const modalRestart = document.querySelector("#MODAL_RESTART");
const modalStart = document.querySelector("#MODAL_START");
const modalScoreEl = document.querySelector("#modalScore");
const buttonRestart = document.querySelector("#buttonRestart");
const buttonStart = document.querySelector("#buttonStart");
const x = canvas.width/2;
const y = canvas.height/2;
const c = canvas.getContext("2d");
const PROJ_SPEED = 6;
const HIT_RANGE = 0.5;
const PLAYER_COLOR = "white";
const PLAYER_SIZE = 10;
const FRICTION = 0.99;
var score = 0;
var animationId;
var intervalId;

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
class Particle{
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

var player = new Player(x,y,PLAYER_SIZE,PLAYER_COLOR);
player.draw();
var projectiles = [];
var enemies = [];
var particles = [];

function Init(){
    player = new Player(x,y,PLAYER_SIZE,PLAYER_COLOR);
    enemies = [];
    projectiles = [];
    particles = [];
    score = 0;
    scoreEl.innerHTML = 0;
}

function spawnEnemy()
{
    intervalId = setInterval(()=>{
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
        
        let color = `hsl(${Math.random()*360}, 50%, 50%)`;
        let angle = Math.atan2(canvas.height/2 - y, canvas.width/2 - x);
        let velocity = {
            x:Math.cos(angle),
            y:Math.sin(angle)
        };
        enemies.push(new Enemy(x,y,radius,color,velocity));
    },1000)
}

function animate()
{
    animationId = window.requestAnimationFrame(animate);
    c.fillStyle = `rgba(0,0,0,0.1)`;
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();
    for(let index = particles.length-1; index >= 0; index--)
    {
        let p = particles[index];
        if(p.alpha < 0)
        {
            particles.splice(index,1);
        }else
        {
            p.update();
        }
    }
    for(let pIndex = projectiles.length-1; pIndex >= 0; pIndex--)
    {
        let p = projectiles[pIndex];
        p.update(); 
        //端に到達した球を削除
        if( p.x - p.radius < 0 ||
            p.x - p.radius > canvas.width ||
            p.y - p.radius < 0 ||
            p.y - p.radius > canvas.height)
        {
            projectiles.splice(pIndex,1);
        }
    }
    for(let eIndex = enemies.length-1; eIndex >= 0; eIndex--)
    {
        let e = enemies[eIndex];
        e.update();
        let dist = Math.hypot(player.x-e.x, player.y-e.y);
        //ゲームオーバー
        if(dist - e.radius - player.radius < HIT_RANGE)
        {
            window.cancelAnimationFrame(animationId);
            clearInterval(intervalId);
            modalRestart.style.display = "block";
            modalScoreEl.innerHTML = score;
        }
        for(let pIndex = projectiles.length-1; pIndex >= 0; pIndex--)
        {
            let p = projectiles[pIndex];
            let dist = Math.hypot(p.x-e.x, p.y-e.y)
            if(dist - e.radius - p.radius< HIT_RANGE)
            {
                for(let i = 0; i < e.radius*2; i++)
                {
                    particles.push(new Particle(p.x, p.y, Math.random()*2, e.color, {x:(Math.random()-0.5)*Math.random()*8, y:(Math.random()-0.5)*Math.random()*8}));
                }
                if(e.radius - 10 > 10)
                {
                    UpdateScore(50);
                    gsap.to(e,{radius:e.radius - 10});
                    projectiles.splice(pIndex,1);
                }else
                {
                    UpdateScore(100);
                    enemies.splice(eIndex,1);
                    projectiles.splice(pIndex,1);
                }
            }
        }
    }
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
        5, PLAYER_COLOR, velocity));
});

function UpdateScore(add)
{
    score += add;
    scoreEl.innerHTML = score
}

buttonRestart.addEventListener("click",()=>{
    Init();
    animate();
    spawnEnemy();
    modalRestart.style.display = "none";
});

buttonStart.addEventListener("click",()=>{
    Init();
    animate();
    spawnEnemy();
    modalStart.style.display = "none";
});