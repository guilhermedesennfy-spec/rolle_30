
const isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);


const BASE_W = 800;
const BASE_H = 1295;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const W = canvas.width;
const H = canvas.height;

//const scaleX = W / BASE_W;
//const scaleY = H / BASE_H;
const scaleX = W / BASE_W;
const scaleY = H / BASE_H;

const scale = (Math.min(scaleX*1.5, scaleY*1.5));


// function degrau(x){
//     const e = Math.E ** (x * 0.2);
//     const k = -((((x * 0.2) - 10) / e) ** 2);
//     return (Math.E ** k) *1.0001; //9;//1.2;//1.6;//1.8801;
// }

const sprites = [];
for (let i = 0; i < 13; i++) {
    const img = new Image();
    img.src = "SEM_FUNDO_SK8/" + i + "Media.png";
    sprites.push(img);
}
const img = new Image();
img.src = "SEM_FUNDO_SK8/bg5Media.png";
sprites.push(img);



function Obj(frame, x, y){
    this.image = sprites[frame];


    this.position = [x,y]//[x * scale, y * scale];
    this.frame = 0;
    this.tick = 0;
    this.pontos = 0;
    this.velocidade = 0;
    this.x = 2;

    this.drawing = function(){
        if ((this.image ==bg.image)){
            ctx.drawImage(
            this.image,
            this.position[0],
            this.position[1],
            W,H//this.image.width * scale,
            //this.image.height * scale
        );
        }else if((this.image ==bg2.image)){
            ctx.drawImage(
            this.image,
            this.position[0],
            this.position[1],W,H
            // this.image.width * scale,
            // this.image.height * scale//W,H
        );}else{
        ctx.drawImage(
            this.image,
            this.position[0],
            this.position[1],
            this.image.width,
            this.image.height
        );}
    };

    this.anim = function(tick,inicio,frames){
        
        this.tick++;
        if (this.tick === tick){
            this.tick = 0;
            this.frame++;
        }
        
        if (this.frame === frames){
            this.frame = inicio;
        }
        this.image = sprites[this.frame];

    };



    
}


function move_bg(bg, bg2){
    const limite = -(bg.image.width) * scale;

    if (bg.position[0] > limite){
        bg.position[0] -= 2 * scale;
    } else {
        bg.position[0] =(bg.image.width) * scale;
    }

    if (bg2.position[0] > -(bg.image.width) * scale){
        bg2.position[0] -= 2 * scale;
    } else {
        bg2.position[0] = bg.image.width * scale;
    }
}







var bg = new Obj(13, 0, 0);
var bg2 = new Obj(13, bg.image.width, 0);
var sk = new Obj(0, W/4, H*0.64);



let clicando = false;


if (!isMobile){
    document.addEventListener("mousedown", () => clicando = true);
    document.addEventListener("mouseup", () => clicando = false);
}else {
    document.addEventListener("touchstart", ()=>clicando = true);
    document.addEventListener("touchend", ()=>clicando = false);
}


function jogo(){
    ctx.clearRect(0, 0, W, H);
    
    bg.drawing();
    bg2.drawing();
    sk.drawing();
    

    move_bg(bg, bg2);
    if (!clicando){
        if ((sk.position[1]<H*0.64*scale)){//&&(sk.position[1]>H*0.65)
            sk.anim(5,8,12)
            sk.position[1]+= H*0.008*scale
            if ((sk.position[1]>H*0.64*scale)){
                sk.position[1]= H*0.64*scale
                sk.frame=0;

            }

        }else{
                sk.anim(11,0,8);
        }
                   
                
    }else{       
        sk.anim(5,8,12)
        sk.position[1]-= H*0.002*scale

    }


    requestAnimationFrame(jogo);
}

jogo();
