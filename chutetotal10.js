// ===============================
// CONFIGURAÇÕES INICIAIS
// ===============================

const isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);

const BASE_W = 800;
const BASE_H = 1295;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const W = canvas.width;
const H = canvas.height;

const scaleX = W / BASE_W;
const scaleY = H / BASE_H;
const scale = Math.min(scaleX * 1.5, scaleY * 1.5);

// Constantes pré-calculadas
const GRAVITY = H * 0.006;
const JUMP = H * 0.002 * scale;
const SK_BASE_Y = H * 0.5;

// ===============================
// CARREGAMENTO DE IMAGENS
// ===============================

function loadImages(paths) {
    return Promise.all(
        paths.map(src => {
            return new Promise(res => {
                const img = new Image();
                img.onload = () => res(img);
                img.src = src;
            });
        })
    );
}

const spritePaths = [
    ...Array.from({ length: 13 }, (_, i) => `SEM_FUNDO_SK8/${i}Media.png`),
    "SEM_FUNDO_SK8/bg5Media.png"
];

// ===============================
// OBJETO BASE
// ===============================

class Obj {
    constructor(image, x, y, tipo = "sprite") {
        this.image = image;
        this.position = [x, y];
        this.frame = 0;
        this.tick = 0;
        this.tipo = tipo;
    }

    draw() {
        if (this.tipo === "bg") {
            ctx.drawImage(this.image, this.position[0], this.position[1], W, H);
        } else {
            ctx.drawImage(this.image, this.position[0], this.position[1]);
        }
    }

    anim(tick, inicio, frames, sprites) {
        if (this.frame < inicio) this.frame = inicio;

        this.tick++;
        if (this.tick >= tick) {
            this.tick = 0;
            this.frame++;
        }

        if (this.frame >= frames) {
            this.frame = inicio;
        }

        this.image = sprites[this.frame];
    }
}

// ===============================
// FUNÇÃO DE MOVIMENTO DO FUNDO
// ===============================

function moveBackground(bg, bg2) {
    const limite = -(bg.image.width) * scale;

    bg.position[0] -= 2 * scale;
    if (bg.position[0] <= limite) {
        bg.position[0] = 0;
    }

    bg2.position[0] = bg.position[0] + (bg.image.width * scale);
}

// ===============================
// LOOP DO JOGO
// ===============================

let clicando = false;
let bg, bg2, sk, sprites;

function startGame(loadedSprites) {
    sprites = loadedSprites;

    const bgImg = sprites[13];

    bg = new Obj(bgImg, 0, 0, "bg");
    bg2 = new Obj(bgImg, bgImg.width * scale, 0, "bg");

    sk = new Obj(sprites[0], W / 4, SK_BASE_Y);

    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    ctx.clearRect(0, 0, W, H);

    bg.draw();
    bg2.draw();
    sk.draw();

    moveBackground(bg, bg2);

    if (!clicando) {
        if (sk.position[1] < SK_BASE_Y) {
            sk.anim(5, 8, 12, sprites);
            sk.position[1] += GRAVITY;
            if (sk.position[1] > SK_BASE_Y) {
                sk.position[1] = SK_BASE_Y;
            }
        } else {
            sk.anim(11, 0, 8, sprites);
        }
    } else {
        sk.anim(5, 8, 12, sprites);
        sk.position[1] -= JUMP;
    }

    requestAnimationFrame(gameLoop);
}

// ===============================
// CONTROLES
// ===============================

if (!isMobile) {
    document.addEventListener("mousedown", () => clicando = true);
    document.addEventListener("mouseup", () => clicando = false);
} else {
    document.addEventListener("touchstart", () => clicando = true);
    document.addEventListener("touchend", () => clicando = false);
}

// ===============================
// INICIAR
// ===============================

loadImages(spritePaths).then(startGame);
