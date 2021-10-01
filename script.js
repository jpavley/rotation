window.addEventListener('load', function() {
        // get and configure the canvas
        const canvas = document.getElementById('canvas1');
        canvas.width = 500;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');

        class Game {
            constructor(ctx, width, height) {
                this.ctx = ctx;
                this.width = width;
                this.height = height;
                this.centerX = width / 2;
                this.centerY = height / 2;
                this.sprites = [
                    new Sprite(this, this.centerX, this.centerY, 200, 200),
                    new Sprite(this, this.centerX, this.centerY - 250, 100, 100),
                    new Sprite(this, this.centerX, this.centerY + 250, 100, 100),
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
            }

            update(deltaTime) {
                this.rotationAmount += (0.05 * deltaTime);
            }

            draw(ctx) {
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


        const game = new Game(ctx, canvas.width, canvas.height);
        let lastTime = 1;
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
    
        animate(0);
});