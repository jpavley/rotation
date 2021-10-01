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
                this.sprites = [new Sprite(this)];
            }

            update(deltaTime) {
                this.sprites.forEach(object => object.update(deltaTime));
            }

            draw() {
                this.sprites.forEach(object => object.draw(this.ctx));
            }
        }

        class Sprite {
            constructor(game) {
                this.game = game;
                this.rotationAmount = 0;
                this.width = 200;
                this.height = 200
                this.x = (game.width / 2) - (this.width / 2);
                this.y = (game.height / 2) - (this.height / 2);
                this.cx = this.x + (this.width / 2);   // x of sprite center
                this.cy = this.y + (this.height / 2);  // y of sprite center
            }

            update(deltaTime) {
                this.rotationAmount += (0.06 * deltaTime);
            }

            draw(ctx) {

                // SHAPE A

                // setup transform for rotation
                ctx.translate(this.cx, this.cy);                       // translate origin to center of sprite
                ctx.rotate( (Math.PI / 180) * -this.rotationAmount);   // rotate by rotationAmount degrees
                ctx.translate(-this.cx, -this.cy);                     // translate origin back to top-left
                
                // draw shape
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = "#ff0000";
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.setTransform(1, 0, 0, 1, 0, 0);                   // reset transform to identity matrix

                // SHAPE B
              
                // setup transform for rotation
                ctx.translate(this.cx, this.cy);                      // translate origin to center of sprite
                ctx.rotate( (Math.PI / 180) * this.rotationAmount);   // rotate by rotationAmount degrees
                ctx.translate(-this.cx, -this.cy);                    // translate origin back to top-left
                
                // draw shape
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = "#0000ff";
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.setTransform(1, 0, 0, 1, 0, 0);                   // return to identity matrix

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