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
const PLAYER_MOVE_INTERVAL = 10;
const keyPressSet = new Set();
var score = 0;
var animationId;
var intervalId;
var inputIntervalId;
var spawnPowerUpId;
var powerUpId;

export {c, player};
import Player from "./modules/player.js";
import Projectile from "./modules/projectile.js";
import Enemy from "./modules/enemy.js";
import Particle from "./modules/particle.js";
import { POWERUP_SPEED, PowerUp } from "./modules/powerup.js";

var player = new Player(x,y,PLAYER_SIZE,PLAYER_COLOR);
var projectiles = [];
var enemies = [];
var particles = [];
var powerUps = [];

function Init(){
    player = new Player(x,y,PLAYER_SIZE,PLAYER_COLOR);
    enemies = [];
    projectiles = [];
    particles = [];
    score = 0;
    scoreEl.innerHTML = 0;
    keyPressSet.clear();
    //入力
    inputIntervalId = setInterval(()=>{
        if(keyPressSet.has("ArrowRight") || keyPressSet.has("d")) player.velocity.x += PLAYER_SPEED;
        if(keyPressSet.has("ArrowLeft")  || keyPressSet.has("a")) player.velocity.x -= PLAYER_SPEED;
        if(keyPressSet.has("ArrowUp")    || keyPressSet.has("w")) player.velocity.y -= PLAYER_SPEED;
        if(keyPressSet.has("ArrowDown")  || keyPressSet.has("s")) player.velocity.y += PLAYER_SPEED;
        if(keyPressSet.has("Escape")) gameOver();
    },PLAYER_MOVE_INTERVAL);
    spawnPowerUp();
}

function spawnPowerUp()
{
    spawnPowerUpId = setInterval(()=>{
        powerUps.push(new PowerUp(
            {
                x:Math.random()*canvas.width,
                y:Math.random()*canvas.height
            },
            {
                x:Math.random()*POWERUP_SPEED,
                y:Math.random()*POWERUP_SPEED
            }
        ));
    },10000);
    
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
    for(let index = powerUps.length-1; index >= 0; index--)
    {
        let powerUp = powerUps[index];
        powerUp.update();
        let dist = Math.hypot(player.x-powerUp.position.x, player.y-powerUp.position.y);
        //パワーアップ取得
        if(dist < powerUp.image.height / 2 + player.radius)
        {
            powerUps.splice(index,1);
            player.powerUp = "machinegun";
            clearTimeout(powerUpId);
            powerUpId = setTimeout(()=>{
                player.powerUp = "none";
                player.color = PLAYER_COLOR;
            }, 5000);
        }
        else
        {
            //端に到達したパワーアップを削除
            if( powerUp.position.x - powerUp.image.height < 0 ||
                powerUp.position.x - powerUp.image.height > canvas.width ||
                powerUp.position.y - powerUp.image.height < 0 ||
                powerUp.position.y - powerUp.image.height > canvas.height)
            {
                powerUps.splice(index,1);
            }
        }
    }
    if(player.powerUp == "machinegun")
    {
        player.color = "yellow";
        let angle = Math.atan2(mouse.position.y - player.y, mouse.position.x - player.x);
        let velocity = {
            x:Math.cos(angle)*PROJ_SPEED*2,
            y:Math.sin(angle)*PROJ_SPEED*2
        };
        projectiles.push(new Projectile(
            player.x,
            player.y,
            5, "yellow", velocity));
    }
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
            gameOver();
        }
        for(let pIndex = projectiles.length-1; pIndex >= 0; pIndex--)
        {
            let p = projectiles[pIndex];
            let dist = Math.hypot(p.x-e.x, p.y-e.y)
            if(dist - e.radius - p.radius< HIT_RANGE)
            {
                //ヒットパーティクルを生成
                for(let i = 0; i < e.radius*2; i++)
                {
                    particles.push(new Particle(p.x, p.y, Math.random()*2, e.color, {x:(Math.random()-0.5)*Math.random()*8, y:(Math.random()-0.5)*Math.random()*8}));
                }
                //大きい敵は縮小
                if(e.radius - 10 > 10)
                {
                    UpdateScore(50);
                    createScoreLabel({x:p.x, y:p.y}, 50);
                    gsap.to(e,{radius:e.radius - 10});
                    projectiles.splice(pIndex,1);
                }
                //小さい敵は消滅
                else
                {
                    UpdateScore(100);
                    createScoreLabel({x:p.x, y:p.y}, 100);
                    enemies.splice(eIndex,1);
                    projectiles.splice(pIndex,1);
                }
            }
        }
    }
}

function createScoreLabel(position, score)
{
    let scoreLabel = document.createElement("label");
    scoreLabel.innerHTML = score;
    scoreLabel.className = "ScoreLabel";
    scoreLabel.style.left = position.x + "px";
    scoreLabel.style.top = position.y + "px";
    document.body.appendChild(scoreLabel);
    gsap.to(scoreLabel, {
        opacity:0, y:-30, duration:1, onComplete:()=>{scoreLabel.parentNode.removeChild(scoreLabel)}
    });
}

function gameOver()
{
    window.cancelAnimationFrame(animationId);
    clearInterval(inputIntervalId);
    clearInterval(spawnPowerUpId);
    clearInterval(powerUpId);
    clearInterval(intervalId);
    modalRestart.style.display = "block";
    gsap.fromTo("#MODAL_RESTART", 
    {scale:0.8, opacity:0},
    {scale:1, opacity:1, ease:"expo"});
    modalScoreEl.innerHTML = score;
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

var mouse = {position:{x:0,y:0}};
window.addEventListener("mousemove",(event)=>{
    mouse.position.x = event.clientX;
    mouse.position.y = event.clientY;
});

window.addEventListener("keyup",(event)=>{
    keyPressSet.delete(event.key);
});
window.addEventListener("keydown",(event)=>{
    keyPressSet.add(event.key);
});