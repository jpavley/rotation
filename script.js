window.addEventListener('load', function() {

    // Classes

    class Game {
        constructor(ctx, width, height) {
            this.ctx = ctx;
            this.width = width;
            this.height = height;
            this.centerX = width / 2;
            this.centerY = height / 2;
            this.staringSize = Math.max(width, height) / 10;
            this.sprites = [
                new Sprite(this, this.centerX, this.centerY, this.staringSize, this.staringSize),
            ];
        }

        update(deltaTime) {
            this.sprites.forEach(object => object.update(deltaTime));
        }

        draw() {
            this.sprites.forEach(object => object.draw(this.ctx));
        }
    }

    class Sprite {
        constructor(game, x, y, width, height) {
            this.game = game;
            this.rotationAmount = 0;
            this.width = width;
            this.height = height;
            this.alpha = 0.5;

            this.x = x - (this.width / 2);
            this.y = y - (this.height / 2);

            this.cx = this.x + (this.width / 2);   // x of sprite center
            this.cy = this.y + (this.height / 2);  // y of sprite center

            this.vx = Math.random() * 0.1 + 0.1;
            this.vy = Math.random() * 0.1 + 0.1;
        }

        update(deltaTime) {
            this.#updatProperties(deltaTime);
            this.#hitTest();
        }

        #updatProperties(deltaTime) {
            this.rotationAmount += (0.05 * deltaTime);
            this.x += this.vx * deltaTime;
            this.y += this.vy * deltaTime;
            this.cx = this.x + (this.width / 2);   // x of sprite center
            this.cy = this.y + (this.height / 2);  // y of sprite center
        }

        #hitTest() {
            // reverse course if sprite hits a wall
            if (this.x < 0 || this.x > (game.width - this.width)) {
                this.vx *= -1;
            }
            if (this.y < 0 || this.y > (game.height - this.height)) {
                this.vy *= -1;
            }
        }

        draw(ctx) {
            // each sprite is composed of three overlapping shapes rotating at different rates/directions
            this.#drawShape("#ff0000", -this.rotationAmount);
            this.#drawShape("#0000ff", this.rotationAmount);
            this.#drawShape("#00ff00", this.rotationAmount/4);
        }

        #drawShape(fillStyle, rotationAmount) {
            this.#transform(rotationAmount);
            this.#render(fillStyle);
        }

        #transform(rotationAmount) {
            ctx.translate(this.cx, this.cy);               // translate origin to center of sprite
            ctx.rotate( (Math.PI / 180) * rotationAmount); // rotate by rotationAmount degrees
            ctx.translate(-this.cx, -this.cy);             // translate origin back to top-left                
        }

        #render(fillStyle) {
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = fillStyle;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform to identity matrix                
            
        }
    }
    
    function animate(timeStamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // deltaTime: elapsed time between frames
        // faster computer, small value for deltaTime
        // slower computer, larger value for deltaTime
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        game.update(deltaTime);
        game.draw();
        //console.log(deltaTime);
        requestAnimationFrame(animate);
    }

    // Start up

    //  - get and configure the canvas
    const canvas = document.getElementById('canvas1');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    // - create game
    const game = new Game(ctx, canvas.width, canvas.height);
    let lastTime = 1;
    // - start animation loop
    animate(0);
});