//Classes

    //Asteroid

        class Asteroid {

            constructor(health){

                this.scoreValue = health;
                this.health = health / 2;
                this.element = document.createElement("img");
                this.element.src = "media/asteroids/asteroid" + randomInt(1,10) + ".png";
                this.element.className = "asteroid";
                this.element.style.width = this.element.style.height = health + "px";
                this.element.style.top = "-" + (health + randomInt(0,80)) + "px";
                this.element.style.left = randomInt(0,(screen.offsetWidth - health)) + "px";

                screen.appendChild(this.element);

            }

        }

//Elements

    //Screen

        const screen = document.querySelector(".screen");

    //Options

        //Settings

            const settingsButton = document.getElementById("settings");

        //Restart

            const reloadButton = document.getElementById("restart");

        //Pause

            const pauseButton = document.getElementById("pause");

    //Score
    
        const score = document.getElementById("score");

    //HUD

        //Settings

            const settingsScreen = document.getElementById("settingsScreen");
            const musicVolume = document.getElementById("musicVolume"); //Range input that dictates the volume of the music
            const soundEffectsVolume = document.getElementById("soundEffectsVolume"); //Range input that dictates the volume of the sound effects
            const settingsExit = document.getElementById("settingsExit"); //button that exits the Settings Screen

        //You Lost

            const youLostScreen = document.getElementById("youLostScreen");
            const tryAgain = document.getElementById("tryAgain"); //button that reloads the page

        //Play

            const playScreen = document.getElementById("playScreen");
            const playButton = document.getElementById("playButton");

    //Spaceship

        const spaceship = document.getElementById("spaceship");
        const bulletCapsule = document.getElementById("bulletCapsule");
        const bullet = document.querySelector(".bullet");
    
//Variables

    //Spaceship

        var isSpaceshipMovingLeft = false;
        var isSpaceshipMovingRight = false;
        var isShooting = false;
        var exploding = false; //created to prevent the spaceship from starting to explode after it's already exploding. Could have named "isSpaceshipExploding".
        var spaceshipForm = 1; //created to toggle the spaceship images to make it look like it's accelerating

    //Asteroids

        var isWaveMoving = false; //created to keep track of the waves of asteroids
        var asteroidsAmount = 0; //created to keep track of the quantity of asteroids still alive
        var asteroids = []; //created to keep track of the asteroids and manipulate them at will

    //Game

        var dead = false;
        var paused = true;
        var scoreCount = 0;

    //Settings
    
        var settingsScreenAppearing = false; //self explanatory lol

//Sounds

    const backgroundMusic = new Audio("media/sounds/retroFunk.mp3");
    const spaceshipExplosion = new Audio("media/sounds/spaceshipExplosion.mp3");

    //Configuration

        //Music

            backgroundMusic.loop = true;
            backgroundMusic.volume = musicVolume.value;

        //Sound Effects

            spaceshipExplosion.volume = soundEffectsVolume.value;

//Entities Positioning

    //Spaceship and Bullet Capsule

        spaceship.style.left = bulletCapsule.style.left = (screen.offsetWidth / 2) - (spaceship.offsetWidth / 2) + "px"; //Positioning the spaceship in the middle of the screen
        spaceship.style.bottom = bulletCapsule.style.bottom = spaceship.offsetHeight + "px"; //Positioning the spaceship to the bottom of the page with a margin equal to the spaceship's height

    //Spaceship accelerating "animation"

        setInterval(function(){

            if (!dead && !paused) {

                if (spaceshipForm == 1) {

                    spaceshipForm = 2;
                    
                }else{

                    spaceshipForm = 1;
                    
                }

                spaceship.src = "media/spaceship/spaceship" + spaceshipForm + ".png";

            }

        },300); //toggles between two spaceship's images to give the impression that it's accelerating

    //Bullet

        bullet.style.left = (bulletCapsule.offsetWidth / 2) - (bullet.offsetWidth / 2) + "px"; //Positioning the bullet reference in the middle of the spaceship
        bullet.style.top = (bulletCapsule.offsetHeight / 3) + "px"; //Positioning the bullet reference in the bottom part of the spaceship

    //Asteroids & Collisions

        const waves = setInterval(function(){

            if (!paused) { //Only continues if the game isn't paused

                if (!isWaveMoving || asteroidsAmount == 0) { //Only continues if the quantity of asteroids is zero, meaning all asteroids has been destroyed or passed by the screen, and the wave is still moving

                    asteroids = createAsteroid(randomInt(10,25)); //creates all the asteroids and push to the variable containing the amount of asteroids (check "var = asteroids" for more details) as an array

                    moveAsteroid(asteroids); //calls the function just once to make the asteroids move in the screen

                }

            }

            if (dead) { //Only continues if the player is dead

                if (screen.contains(spaceship)) { //Set up to make sure the error "It's not a child of it's parent" isn't generated

                    if (bulletCapsule.contains(bullet)) { //Set up to make sure the error "It's not a child of it's parent" isn't generated

                        bulletCapsule.removeChild(bullet); //Removes the bullet reference from the page

                    }

                    if (!exploding) { //Only continues if the spaceship is not exploding

                        setTimeout(function(){

                            exploding = true;

                            spaceshipExplosion.play(); //Plays the sound of the spaceship exploding

                            let bullets = document.getElementsByClassName("bullet"); //Gets all bullets that were fired

                            while(bullets.length > 0){

                                if (screen.contains(bullets[0])) bullets[0].remove(); //Removes all the bullets that were fired

                            }

                            let stages = 1; //Created to keep track of the explosion "animation"

                            let explode = setInterval(function(){

                                if (stages < 8) { //Only continues if the spaceship is still exploding

                                    spaceship.src = "media/explosion/" + stages + ".png"; //Alters the spaceship's image to give the impression of an explosion

                                    if (stages == 2) {

                                        spaceship.style.width = "44.6px"; //Alters the spaceship's width to make sure the explosion animation has the same width and height, since the spaceship's dimensions don't result in a square

                                    }

                                    stages += 1;

                                }else{

                                    if (screen.contains(spaceship)) screen.removeChild(spaceship); //Set up to make sure the error "It's not a child of it's parent" isn't generated
                                    if (screen.contains(bulletCapsule)) screen.removeChild(bulletCapsule); //Set up to make sure the error "It's not a child of it's parent" isn't generated
                                    screen.style.animationPlayState = "paused"; //Stops the background image animation
                                    youLostScreen.style.display = "block"; //Displays the "You Lost" screen
                                    backgroundMusic.pause(); //Pauses the background music
                                    pauseButton.style.display = "none"; //Removes the pause button
                                    clearInterval(explode); //Stops the explosion

                                }

                            },200); //Each 200 milliseconds the spaceship's image will be altered to give the impression of an explosion animation. After the explosion ends, the game ends

                        },100); //Sleeps for 100 milliseconds to make sure the spaceship's visual position is colliding with the asteroids' visual position or its explosions

                    }

                }

            }

        },500); //Each 500 milliseconds (half of a second), the game status will be checked (if it's paused or if the player is dead).

//Keys Control

    //Pressing

        document.addEventListener("keydown", function(event){ //Executes block of code whenever a keyboard's key is pressed

            move();

        });

        document.addEventListener("mousedown", function(event){ //Executes block of code whenever the mouse's left button is clicked

            fire(asteroids);

        });

    //Realesing

        document.addEventListener("keyup", function(event){ //Executes the block of code whenever a keyboard's key is not pressed anymore


        });
 
        document.addEventListener("mouseup", function(event){ //Executes the block of code whenever the mouse's left button is not pressed anymore

            isShooting = false;

        });

//Options

    //Settings

        settingsButton.addEventListener("click",function(){ //Executes block of code whenever the option settings screen icon is clicked

            if (playScreen.style.display != "none" || dead) return; //Does nothing if the player is dead or the "Play" screen is appearing

            if (!paused) { //Only continues if the game is not paused

                pause(); //Pauses the game

            }

            if (paused && settingsScreenAppearing) { //Only continues if the game is paused and the settings screen is appearing

                pause(); //Unpauses the game

            }
            
            if (settingsScreenAppearing == true) { //Only continues if the settings screen is appearing

                settingsScreen.style.display = "none"; //Removes the settings screen
                settingsScreenAppearing = false;
                pauseButton.style.display = "inline"; //Displays the pause button

            }else{ //Only continues if the settings screen is not appearing

                settingsScreen.style.display = "block"; //Displays the settings screen
                settingsScreenAppearing = true;
                pauseButton.style.display = "none"; //Removes the pause button

            }

        });

        settingsExit.addEventListener("click",function(){

            pause();
            settingsScreen.style.display = "none";
            settingsScreenAppearing = false;
            pauseButton.style.display = "inline";

        });

        //Music

            musicVolume.addEventListener("input",function(){

                backgroundMusic.volume = musicVolume.value;

            });

        //Sound Effects

            soundEffectsVolume.addEventListener("input",function(){

                spaceshipExplosion.volume = soundEffectsVolume.value;

            });

    //Pause

        pauseButton.addEventListener("click",function(){ //Executes block of code when the pause button is clicked

            pause(); //Pauses or unpauses the game

        });

    //Restart

        reloadButton.addEventListener("click",function(){ //Executes block of code whenever the restart button is clicked

            location.reload(); //Reloads the page

        });

//HUD

    //Play Game

        playButton.addEventListener("click",function(){ //Executes block of code whenever the play button is clicked

            pause(); //Unpauses the game
            playScreen.style.display = "none"; //Removes the play screen
            pauseButton.style.display = "inline"; //Displays the pause button

        });

    //You Lost

        tryAgain.addEventListener("click",function(){ //Executes block of code whenever the try again button is clicked

            location.reload(); //Reloads the page

        });

//Methods

    //Options

        //Pause

            function pause(){

                if (paused) {

                    paused = false;
                    pauseButton.src = "media/options/pause.png";
                    screen.style.animationPlayState = "running";
                    if (asteroidsAmount > 0) {

                        for (var i = asteroids.length - 1; i >= 0; i--) {
                            asteroids[i].element.style.animationPlayState = "running";
                        }

                    }
                    backgroundMusic.play();


                }else{

                    paused = true;
                    pauseButton.src = "media/options/play.png";
                    screen.style.animationPlayState = "paused";
                    if (asteroidsAmount > 0) {

                        for (var i = asteroids.length - 1; i >= 0; i--) {
                            asteroids[i].element.style.animationPlayState = "paused";
                        }

                    }
                    backgroundMusic.pause();

                }

            }

    //Spaceship

        //Move

            function move(){

                if (paused || dead) return;

                let xPosition = spaceship.offsetLeft;

                let currentPosition = spaceship.offsetLeft;

                if (event.key == "d") {

                    if (isSpaceshipMovingLeft){

                        isSpaceshipMovingLeft = false;
                        clearInterval(moveLeft)

                    }

                    if (spaceship.offsetLeft + spaceship.offsetWidth + (spaceship.offsetWidth / 2) < screen.offsetWidth) {

                        var moveRight = setInterval(function(){

                            if (xPosition <= currentPosition + (spaceship.offsetWidth / 2)) {

                                xPosition += 1;//(spaceship.offsetWidth / 75);

                                spaceship.style.left = bulletCapsule.style.left = xPosition + "px";

                                isSpaceshipMovingRight = true;

                            }else{

                                isSpaceshipMovingRight = false;
                                clearInterval(moveRight);

                            }

                        },5);

                    }else{

                        return;

                    }

                }

                if (event.key == "a") {

                    if (isSpaceshipMovingRight){

                        isSpaceshipMovingRight = false;
                        clearInterval(moveRight)

                    }

                    if (spaceship.offsetLeft - (spaceship.offsetWidth / 2) > 0) {

                        var moveLeft = setInterval(function(){

                            if (xPosition >= currentPosition - (spaceship.offsetWidth / 2)) {

                                xPosition -= 1;//(spaceship.offsetWidth / 75);

                                spaceship.style.left = bulletCapsule.style.left = xPosition + "px";

                                isSpaceshipMovingLeft = true;

                            }else{

                                isSpaceshipMovingLeft = false;
                                clearInterval(moveLeft);

                            }

                        },5)

                    }else{

                        return;

                    }

                }

            }

        //Fire

            function fire(asteroids){

                if (paused) return;

                if (event.button === 0) {

                    if (isShooting || dead) {

                        return;

                    }

                    let firedBullet = document.createElement("img");

                    firedBullet.src = "media/spaceship/projectile.png";
                    firedBullet.className = "bullet";

                    firedBullet.style.left = bulletCapsule.offsetLeft + ((bulletCapsule.offsetWidth / 2) - (bullet.offsetWidth / 2)) + "px";
                    firedBullet.style.top = bulletCapsule.offsetTop + (bulletCapsule.offsetHeight / 3) + "px";

                    screen.appendChild(firedBullet);

                    let yPosition = bulletCapsule.offsetTop + (bulletCapsule.offsetHeight / 2);

                    var shoot = setInterval(function(){

                        if (paused) return;

                        for (var i = asteroids.length - 1; i >= 0; i--) {
                            
                            if (checkCollision(firedBullet,asteroids[i].element)) {

                                clearInterval(shoot);

                                if (screen.contains(firedBullet)) {

                                    screen.removeChild(firedBullet);

                                }

                                asteroids[i].health -= 10;

                                if (asteroids[i].health <= 0) {

                                    if (screen.contains(asteroids[i].element)) {

                                        if (!asteroids[i].exploding) {

                                            let stages = 1;

                                            asteroids[i].exploding = true;

                                            let element = asteroids[i].element;

                                            let scoreValue = asteroids[i].scoreValue;

                                            let explosionSound = new Audio("media/sounds/asteroidExplosion" + randomInt(1,2) + ".mp3");

                                            explosionSound.volume = soundEffectsVolume.value;

                                            explosionSound.play();

                                            let explode = setInterval(function(){

                                                if (stages < 8) {

                                                    // console.log(element.src);
                                                    element.src = "media/explosion/" + stages + ".png";
                                                    stages += 1;

                                                }else{

                                                    clearInterval(explode);
                                                    if (screen.contains(element)) {

                                                        screen.removeChild(element);
                                                        asteroidsAmount -= 1;

                                                        scoreCount += scoreValue;
                                                        score.innerHTML = (scoreCount);

                                                    }

                                                }

                                            },100);
                                            
                                        }

                                        // screen.removeChild(asteroids[i].element);

                                        // asteroidsAmount -= 1;
                                        // console.log(asteroidsAmount);

                                    }

                                }

                            }

                        }

                        if (firedBullet && firedBullet.offsetTop >= 0) {

                            yPosition -= (bullet.offsetHeight);

                            firedBullet.style.top = yPosition + "px";

                        }else{

                            screen.removeChild(firedBullet);

                            clearInterval(shoot);

                        }

                    },50);

                    isShooting = true;

                }

            }

    //Asteroid

        //Create Asteroid

            function createAsteroid(amount){

                if (paused || dead) return;

                let array = [];

                array.length = amount;

                asteroidsAmount = amount;

                for (var i = array.length - 1; i >= 0; i--) {
                    
                    array[i] = new Asteroid(randomInt(25,50));

                    if (randomInt(1,10) % 2 == 0) {

                        array[i].element.style.animationName = "rotateAsteroidLeft";

                    }else{

                        array[i].element.style.animationName = "rotateAsteroidRight";

                    }
                
                }

                return array;

            }

        //Move Asteroid

            function moveAsteroid(array){

                if (paused || dead) return;

                isWaveMoving = true;

                asteroidAmount = array.length;

                const moveAsteroid = setInterval(function(){

                    if (paused) return;

                    for (var i = array.length - 1; i >= 0; i--) {
                        
                        if (array[i].element.offsetTop < screen.offsetHeight) {

                            array[i].element.style.top = parseInt(array[i].element.style.top) + 1 + "px";

                            if (checkCollision(spaceship,array[i].element)) {

                                if (array[i].element.offsetWidth >= spaceship.offsetWidth) {

                                    dead = true; //dead

                                }

                            }

                        }else{

                            screen.removeChild(array[i].element);

                            asteroidsAmount -= 1;

                        }

                    }

                    if (asteroidAmount == 0) {

                        clearInterval(moveAsteroid);

                        isWaveMoving = false;

                    }

                },15);

            }

    //Static

        //Check Collision

            function checkCollision (element1, element2){

                if (paused) return;

                if (

                    // If element1 is above element2

                    element1.offsetTop + element1.offsetHeight < element2.offsetTop ||

                    // If element1 is under element2

                    element1.offsetTop > element2.offsetTop + element2.offsetHeight ||

                    // If element1 is after element2

                    element1.offsetLeft > element2.offsetLeft + element2.offsetWidth ||

                    // If element1 is before element2

                    element1.offsetLeft + element1.offsetWidth < element2.offsetLeft

                    ) {

                    return false;

                }else{

                    return true;

                }

            }

        //Random Integer

            function randomInt(min, max) {
                
                return Math.floor(Math.random() * (max - min + 1)) + min;
            
            }

//End