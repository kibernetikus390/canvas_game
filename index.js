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
const PLAYER_SPEED = 0.5;
const PLAYER_MAX_SPEED = 5;
const PLAYER_MOVE_INTERVAL = 10;
const FRICTION = 0.99;
const FRICTION_PLAYER = 0.9;
const SPIN_RADIUS = 30;
const SPIN_SPEED  = 0.1;
const keyPressSet = new Set();
var score = 0;
var animationId;
var intervalId;
var inputIntervalId;

class Player{
    constructor(x,y,radius,color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = {x:0,y:0};
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
            console.log(Hypotenuse);
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
        this.draw();
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
    keyPressSet.clear();
    inputIntervalId = setInterval(()=>{
        if(keyPressSet.has("ArrowRight") || keyPressSet.has("d")) player.velocity.x += PLAYER_SPEED;
        if(keyPressSet.has("ArrowLeft")  || keyPressSet.has("a")) player.velocity.x -= PLAYER_SPEED;
        if(keyPressSet.has("ArrowUp")    || keyPressSet.has("w")) player.velocity.y -= PLAYER_SPEED;
        if(keyPressSet.has("ArrowDown")  || keyPressSet.has("s")) player.velocity.y += PLAYER_SPEED;
    },PLAYER_MOVE_INTERVAL);
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
    player.update();
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
            clearInterval(inputIntervalId);
            clearInterval(intervalId);
            modalRestart.style.display = "block";
            gsap.fromTo("#MODAL_RESTART", 
            {scale:0.8, opacity:0},
            {scale:1, opacity:1, ease:"expo"});
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

canvas.addEventListener("click",(event)=>{
    let angle = Math.atan2(event.clientY - player.y, event.clientX - player.x);
    let velocity = {
        x:Math.cos(angle)*PROJ_SPEED,
        y:Math.sin(angle)*PROJ_SPEED
    };
    projectiles.push(new Projectile(
        player.x,
        player.y,
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
    gsap.to("#MODAL_RESTART",{
        opacity: 0,
        scale:0.8,
        duration:0.3,
        ease: "expo.in",
        onComplete: ()=>{
            modalRestart.style.display = "none";
        }
    });
});

buttonStart.addEventListener("click",()=>{
    Init();
    animate();
    spawnEnemy();
    gsap.to("#MODAL_START",{
        opacity: 0,
        scale:0.8,
        duration:0.3,
        ease: "expo.in",
        onComplete: ()=>{
            modalStart.style.display = "none";
        }
    });
});

window.addEventListener("keyup",(event)=>{
    keyPressSet.delete(event.key);
});
window.addEventListener("keydown",(event)=>{
    keyPressSet.add(event.key);
});