const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
context.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.7;

const button = document.getElementById('start');
const playAgain = document.getElementById('play');
play.style.display = "none";

class Sprite {
  constructor({position, velocity, isTagged}) {
    this.position = position;
    this.velocity = velocity;
    this.height = 60;
    this.width = 30;
    this.lastKey;
    this.grounded = false;
    this.numJumps = 0;
    this.isTagged = isTagged;
  }

  draw(color) {
    context.fillStyle = color;
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }



  update(color) {
    this.draw(color)

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
      this.grounded = true;
      this.numJumps = 0;
      this.position.y = canvas.height-this.height;
    } else if (this.position.y <= 0) {
      this.velocity.y = 0;
      this.velocity.y += gravity;
      this.grounded = false;
    } else {
      this.velocity.y += gravity;
      this.grounded = false;
    }

    if (this.position.x <= 0) {
      this.position.x = 0;
    } else if (this.position.x + this.width >= canvas.width) {
      this.position.x = canvas.width - this.width;
    }
  }

  tag(other){
    this.isTagged = false;
    other.isTagged = true;
  }
}

const player = new Sprite({
  velocity: {
    x: 0,
    y: 0
  },
  position: {
    x: 0,
    y: 0
  },
  isTagged:true
});
player.draw('red');


const enemy = new Sprite({
  position: {
    x: 400,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  isTagged:false
});
enemy.draw('blue');

const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowUp:{
    pressed:false
  }
}

let start = false;

let time = 120;
setInterval(()=>{
  time--;
},1000);

let playerDashFrames = 0;
let enemyDashFrames = 0;

let touchy = false;
function animate() {
  
  const animationId = window.requestAnimationFrame(animate);

  let isTouch = Math.abs(player.position.x-enemy.position.x)<=player.width && Math.abs(player.position.y-enemy.position.y)<=player.height;
  
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);
  player.update('red');
  enemy.update('blue');

  context.font = "30px Comic Sans Ms";
  context.fillStyle = "white";
  context.textAlign="center";
  context.fillText(`Time: ${time}`,canvas.width/2,50);

  if(player.isTagged){
    context.fillStyle = "red";
    context.fillText("Red is tagged",canvas.width/2,100);
  }else if(enemy.isTagged){
    context.fillStyle = "blue";
    context.fillText("Blue is tagged",canvas.width/2,100);
  }

  if(!touchy&&isTouch){
    touchy = true;
  }

  if(touchy&&!isTouch){
    if(player.isTagged){
      player.tag(enemy);
    }else{
      enemy.tag(player);
    }
    touchy=false;
  }
  
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -randomstuff;
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = randomstuff;
  }

  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -randomthingy;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = randomthingy;
  }
  if(keys.ArrowUp.pressed){
    enemy.velocity.y = -20;
    enemy.numJumps++;
    keys.ArrowUp.pressed = false;
  }if(keys.w.pressed){
    player.velocity.y = -20;
    player.numJumps++;
    keys.w.pressed = false;
  }

  if(time<=0){
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'red';
    context.fillRect(player.position.x,player.position.y,player.width,player.height);

    context.fillStyle = 'blue';
    context.fillRect(enemy.position.x,enemy.position.y,enemy.width,enemy.height);

    if(player.isTagged){
      context.font = "100px Comic Sans Ms";
      context.textAlign="center";
      context.textBaseline='center';
      context.fillStyle = 'blue';
      context.fillText("Blue wins!",canvas.width/2,canvas.height/2);
    }else{
      context.font = "100px Comic Sans Ms";
      context.textAlign="center";
      context.textBaseline='center';
      context.fillStyle = 'red';
      context.fillText("Red wins!",canvas.width/2,canvas.height/2);
    }
    playAgain.style.display = "block";
    window.cancelAnimationFrame(animationId);
  }
}

button.onclick = ()=>{
  animate();
  button.style.display="none";
};

playAgain.onclick=()=>{
  time=120;
  playAgain.style.display = "none";
  animate();
};

let randomstuffy = true;
let randomstuff = 5
let randomthingy = 5;
let randombool = true;

window.addEventListener('keydown',(event)=>{
  switch (event.key) {
    case 'd':
      keys.d.pressed = true;
      player.lastKey = 'd';
      break;
    case 'a':
      keys.a.pressed = true;
      player.lastKey = 'a';
      break;
    case 'w':
      if (player.grounded || player.numJumps < 2) {
        keys.w.pressed = true;
      }
      break;

    case 'q':
      if(randomstuffy){
        randomstuffy =false;
        randomstuff = 20;
        setTimeout(()=>{
          randomstuff = 5;
        },50);
        setTimeout(()=>{
          randomstuffy = true;
        },1000);
      }
      break;
      
    case 'ArrowDown':
      if(randombool){
        randombool =false;
        randomthingy = 20;
        setTimeout(()=>{
          randomthingy = 5;
        },50);
        setTimeout(()=>{
          randombool = true;
        },1000);
      }
      break;

    case 'ArrowRight':
      keys.ArrowRight.pressed = true;
      enemy.lastKey = 'ArrowRight';
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = 'ArrowLeft';
      break;
    case 'ArrowUp':
      if (enemy.grounded || enemy.numJumps < 2) {
        keys.ArrowUp.pressed = true;
      }
      break;
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;

    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
  }
});

window.addEventListener('resize',()=>{
  canvas.width=window.innerWidth;
  canvas.height = window.innerHeight;
});
