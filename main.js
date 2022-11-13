const CANVAS = document.querySelector("canvas");
const CONTEXT = CANVAS.getContext("2d");

CANVAS.width = 1024;
CANVAS.height = 576;

CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);

const GRAVITY = 0.2;


const BACKGROUND = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: "back1.png",
})

const SHOP = new Sprite({
    position: {
        x: 600,
        y: 290,
    },
    imageSrc: "shop.png",
    scale: 1.9,
    framesMax: 6,
})


const PLAYER = new Fighter({
    position: {x: 0, y: 0}, 
    velocity: {x: 0, y: 1}, 
    offset: {x: 0, y: 0}, 
    imageSrc: "Huntress/Idle.png", 
    framesMax: 8, 
    scale: 3.4, 
    offset: {x: 215, y: 150},
    sprites: {
        idle: {
            imageSrc: "Huntress/Idle.png",
            framesMax: 8,
        },
        run: {
            imageSrc: "Huntress/Run.png",
            framesMax: 8,

        },
        jump: {
            imageSrc: "Huntress/Jump.png",
            framesMax: 2,
 
        },
        fall: {
            imageSrc: "Huntress/Fall.png",
            framesMax: 2,
        },
        attack1: {
            imageSrc: "Huntress/Attack1.png",
            framesMax: 5,
        },
        takeHit: {
            imageSrc: "Huntress/Take hit.png",
            framesMax: 3,
        },
        death: {
            imageSrc: "Huntress/Death.png",
            framesMax: 8,
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50,
        },
        width: 100,
        height: 50,
    }
});
const ENEMY = new Fighter({
    position: {x: 400, y: 0}, 
    velocity: {x: 0, y: 1}, 
    color: "blue", 
    offset: {x: -50, y: 0},
    imageSrc: "Martial Hero 2/Idle.png", 
    framesMax: 4, 
    scale: 2.6, 
    offset: {x: 215, y: 150},
    sprites: {
        idle: {
            imageSrc: "Martial Hero 2/Idle.png",
            framesMax: 4,
        },
        run: {
            imageSrc: "Martial Hero 2/Run.png",
            framesMax: 8,

        },
        jump: {
            imageSrc: "Martial Hero 2/Jump.png",
            framesMax: 2,
 
        },
        fall: {
            imageSrc: "Martial Hero 2/Fall.png",
            framesMax: 2,
        },
        attack1: {
            imageSrc: "Martial Hero 2/Attack1.png",
            framesMax: 4,
        },
        takeHit: {
            imageSrc: "Martial Hero 2/Take hit.png",
            framesMax: 3,
        },
        death: {
            imageSrc: "Martial Hero 2/Death.png",
            framesMax: 7,
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50,
        },
        width: 200,
        height: 50,
    }
});

const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
}
function rectangularCollision({
    rectangle1,
    rectangle2,
}){
    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
}

function determineWinner({PLAYER, ENEMY, timerID}){
    clearTimeout(timerID);
    document.querySelector(".tie").style.display = "flex";
    if(PLAYER.health === ENEMY.health){
        document.querySelector(".tie").innerHTML = "Tie";
    }else if(PLAYER.health > ENEMY.health){
        document.querySelector(".tie").innerHTML = "Player 1 Wins";
    }else if(ENEMY.health > PLAYER.health){
    document.querySelector(".tie").innerHTML = "Player 2 Wins";
}
}

let timer = 60;
let timerID;
function decreaseTimer(){

    if(timer > 0){
       timerID = setTimeout(decreaseTimer, 1000)
        timer--;
        document.querySelector(".timer").innerHTML = timer;
    }

    if(timer === 0){
        determineWinner({PLAYER, ENEMY, timerID});
    }


}

decreaseTimer();

function animate(){
    window.requestAnimationFrame(animate);
    CONTEXT.fillStyle = "black";
    CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);
    BACKGROUND.update();
    SHOP.update();
    PLAYER.update();
    ENEMY.update();



    // Player movement

    PLAYER.velocity.x = 0;
    if(keys.a.pressed && PLAYER.lastKey === "a"){
        PLAYER.velocity.x = -3;
        PLAYER.switchSprite("run");
    }else if (keys.d.pressed && PLAYER.lastKey === "d"){
        PLAYER.velocity.x = 3;
        PLAYER.switchSprite("run");
    }else {
        PLAYER.switchSprite("idle");
    }
    if(PLAYER.velocity.y < 0){
        PLAYER.switchSprite("jump");
    }else if(PLAYER.velocity.y > 0){
        PLAYER.switchSprite("fall");
    }
    // Enemy movement
    ENEMY.velocity.x = 0;
    if(keys.ArrowLeft.pressed && ENEMY.lastKey === "ArrowLeft"){
        ENEMY.velocity.x = -3;
        ENEMY.switchSprite("run");
    }else if (keys.ArrowRight.pressed && ENEMY.lastKey === "ArrowRight"){
        ENEMY.velocity.x = 3;
        ENEMY.switchSprite("run");
    }else {
        ENEMY.switchSprite("idle");
    }

    if(ENEMY.velocity.y < 0){
        ENEMY.switchSprite("jump");
    }else if(ENEMY.velocity.y > 0){
        ENEMY.switchSprite("fall");
    }

    // Collision

    if(rectangularCollision({rectangle1: PLAYER, rectangle2: ENEMY}) && PLAYER.isAttacking && PLAYER.frameCurrent === 3){
            ENEMY.takeHit();
            PLAYER.isAttacking = false;
            document.querySelector(".enemyHealth").style.width = ENEMY.health + "%";
    }
    if(PLAYER.isAttacking && PLAYER.frameCurrent === 5){
        PLAYER.isAttacking = false;
    }
    if(rectangularCollision({rectangle1: ENEMY, rectangle2: PLAYER}) && ENEMY.isAttacking && ENEMY.frameCurrent === 2){
        PLAYER.takeHit();
        ENEMY.isAttacking = false;
        document.querySelector(".playerHealth").style.width = PLAYER.health + "%";

    }

    if(ENEMY.isAttacking && ENEMY.frameCurrent === 2){
        ENEMY.isAttacking = false;
    }
    // END

    if(ENEMY.health <= 0 || PLAYER.health <= 0){
        determineWinner({PLAYER, ENEMY, timerID});
    }
}

animate();

window.addEventListener("keydown", (event) => {
    if(!PLAYER.dead){

    switch (event.key){
        case "d": 
            keys.d.pressed = true;
            PLAYER.lastKey = "d";
        break
        case "a":
            keys.a.pressed = true;
            PLAYER.lastKey = "a";
        break
        case "w":
            PLAYER.velocity.y = -10;
            break
        case " ":
            PLAYER.attack();
        break         
    }
        }   
if(!ENEMY.dead){
    switch(event.key){
        case "ArrowRight": 
            keys.ArrowRight.pressed = true;
            ENEMY.lastKey = "ArrowRight";
        break
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            ENEMY.lastKey = "ArrowLeft";
        break
        case "ArrowUp":
            ENEMY.velocity.y = -10;
        break
        case "ArrowDown":
            ENEMY.attack();
        break
    }
}
});


window.addEventListener("keyup", (event) => {
    switch (event.key){
        case "d": 
            keys.d.pressed = false;
        break
        case "a":
            keys.a.pressed = false;
        break
    }

    // enemy key
    switch (event.key){
    case "ArrowRight": 
        keys.ArrowRight.pressed = false;
    break
    case "ArrowLeft":
        keys.ArrowLeft.pressed = false;
    break
    case "ArrowDown":
        ENEMY.isAttacking = false;
    break
}

});


