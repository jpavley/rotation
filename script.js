window.addEventListener('load', function() {

    // Classes

    class Game {
        constructor(ctx, width, height) {
            this.ctx = ctx;
            this.width = width;
            this.height = height;

            this.centerX = width / 2;
            this.centerY = height / 2;
            this.staringSize = Math.max(width, height) / 5;

            this.sprites = [];
            this.spriteInterval = 500;
            this.spriteTimer = 0;

            this.compassPoints = ["n", "e", "s", "w"];
            this.currentCompassPoint = -1;
            this.maxCompassPoints = this.compassPoints.length;

            this.radius = 300;

            this.addSprite();
        }


        addSprite() {

            const newSprite = new Sprite(this, this.centerX, this.centerY, this.staringSize, this.staringSize)

            switch (this.compassPoints[this.currentCompassPoint]) {
                case 'n':
                    newSprite.vx *= -1;
                    newSprite.vy *= -1;
                    break;
                case 'e':
                    newSprite.vx *= 1;
                    newSprite.vy *= 1;
                    break;
                case 's':
                    newSprite.vx *= 1;
                    newSprite.vy *= -1;
                    break;
                case 'w':
                    newSprite.vx *= -1;
                    newSprite.vy *= 1;
                    break;
            }

            this.currentCompassPoint += 1;
            if (this.currentCompassPoint >= this.maxCompassPoints) {
                this.currentCompassPoint = 0;
            }

            this.sprites.push(newSprite);
        }

        update(deltaTime) {
            this.sprites = this.sprites.filter(object => !object.deleteMe);

            if (this.spriteTimer > this.spriteInterval) {
                this.addSprite();
                this.spriteTimer = 0;
            } else {
                this.spriteTimer += deltaTime;
            }

            this.sprites.forEach(object => object.update(deltaTime));
        }

        draw() {
            // this.ctx.beginPath();
            // this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
            // this.ctx.clip();
            // this.ctx.fillStyle = '#f4f0ec';
            // this.ctx.fillRect(0, 0, this.width, this.height);
            this.sprites.forEach(object => object.draw(this.ctx));
        }
    }

    class Sprite {
        constructor(game, x, y, width, height) {
            this.game = game;
            this.rotationAmount = 0;
            this.rotationIncrement = Math.random() * 0.1 + 0.05;
            this.width = width;
            this.height = height;
            this.alpha = 0.5;

            this.x = x - (this.width / 2);
            this.y = y - (this.height / 2);
            this.vx = Math.random() * 0.3 + 0.05;
            this.vy = Math.random() * 0.3 + 0.05;

            this.cx = this.x + (this.width / 2);   // x of sprite center
            this.cy = this.y + (this.height / 2);  // y of sprite center

            this.deleteMe = false;
            this.hitCount = 0;
            this.maxHits = 10;

            this.colorA = "#" + Math.floor(Math.random()*16777215).toString(16);
            this.colorB = "#" + Math.floor(Math.random()*16777215).toString(16);;
            this.colorC = "#" + Math.floor(Math.random()*16777215).toString(16);;
        }

        update(deltaTime) {

            if(this.hitCount >= this.maxHits) {
                this.deleteMe = true;
            }

            this.updatProperties(deltaTime);
            this.hitTest();
        }

        updatProperties(deltaTime) {
            this.rotationAmount += (this.rotationIncrement * deltaTime);
            this.x += this.vx * deltaTime;
            this.y += this.vy * deltaTime;
            this.cx = this.x + (this.width / 2);   // x of sprite center
            this.cy = this.y + (this.height / 2);  // y of sprite center
        }

        calcHypotenuse(aX, aY, bX, bY) {
            // use the pythagorean theorem to calc distance between two particles
            // a^2 + b^2 = c^2 (width squared + height squared = hypotenuse squared)
            const dx = aX - bX;
            const dy = aY - bY;
            const hypotenuse = Math.sqrt((dx ** 2) + (dy ** 2));
            return hypotenuse;
          }
      
          hitTest() {
            let hit = false;
            
            const hypotenuse = this.calcHypotenuse(game.centerX, game.centerY,
              this.x, this.y);
              
            if (hypotenuse > this.game.radius) {
              this.vx *= -1.0;
              this.vy *= -1.0;
              hit = true;
            }
      
            if (hit) {
              this.hitCount += 1;
              this.width *= 0.8;
              this.height *= 0.8;
            }
          }
        draw(ctx) {
            // each sprite is composed of three overlapping shapes rotating at different rates/directions
            this.drawShape(this.colorA, -this.rotationAmount);
            this.drawShape(this.colorB, this.rotationAmount);
            this.drawShape(this.colorC, this.rotationAmount/4);
        }

        drawShape(fillStyle, rotationAmount) {
            this.transform(rotationAmount);
            this.render(fillStyle);
        }

        transform(rotationAmount) {
            ctx.translate(this.cx, this.cy);               // translate origin to center of sprite
            ctx.rotate( (Math.PI / 180) * rotationAmount); // rotate by rotationAmount degrees
            ctx.translate(-this.cx, -this.cy);             // translate origin back to top-left                
        }

        render(fillStyle) {
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