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
                this.rotationAmount = 0;
            }

            update(deltaTime) {
                this.rotationAmount += (0.06 * deltaTime);
            }

            draw() {
                const width  = 200;
                const height = 200
                const x      = (canvas.width / 2) - (width / 2);
                const y      = (canvas.height / 2) - (height / 2);
                const cx     = x + (width / 2);   // x of shape center
                const cy     = y + (height / 2);  // y of shape center

                //ctx.save();
                ctx.translate(cx, cy);              //translate to center of shape
                ctx.rotate( (Math.PI / 180) * -this.rotationAmount);   //rotate 1 degrees.
                ctx.translate(-cx, -cy);            //translate center back to 0,0
                
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = "#ff0000";
                ctx.fillRect(x, y, width, height);  //draw normal shape
                ctx.setTransform(1, 0, 0, 1, 0, 0); // return to identity matrix
                //ctx.restore();
              
                //ctx.save();
                ctx.translate(cx, cy);              //translate to center of shape
                ctx.rotate( (Math.PI / 180) * this.rotationAmount);   //rotate 1 degrees.
                ctx.translate(-cx, -cy);            //translate center back to 0,0
                
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = "#0000ff";
                ctx.fillRect(x, y, width, height);
                ctx.setTransform(1, 0, 0, 1, 0, 0);  // return to identity matrix
                //ctx.restore();

            }
        }

        class Sprite {
            constructor() {
                this.rotationAmount = 0;
                this.width = 200;
                this.height = 200
                this.x = (canvas.width / 2) - (width / 2);
                this.y = (canvas.height / 2) - (height / 2);
                this.cx = x + (width / 2);   // x of sprite center
                this.cy = y + (height / 2);  // y of sprite center
            }

            update(deltaTime) {
                this.rotationAmount += (0.06 * deltaTime);
            }

            draw() {

                // SHAPE A

                // setup transform for rotation
                ctx.translate(this.cx, this.cy);                       // translate origin to center of sprite
                ctx.rotate( (Math.PI / 180) * -this.rotationAmount);   // rotate by rotationAmount degrees
                ctx.translate(-cx, -cy);                               // translate origin back to top-left
                
                // draw shape
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = "#ff0000";
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.setTransform(1, 0, 0, 1, 0, 0);                   // reset transform to identity matrix

                // SHAPE B
              
                // setup transform for rotation
                ctx.translate(cx, cy);                                // translate origin to center of sprite
                ctx.rotate( (Math.PI / 180) * this.rotationAmount);   // rotate by rotationAmount degrees
                ctx.translate(-cx, -cy);                              // translate origin back to top-left
                
                // draw shape
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = "#0000ff";
                ctx.fillRect(x, y, width, height);
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