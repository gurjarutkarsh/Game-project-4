// Game state variables
var isLeft = false;
var isRight = false;
var isFalling = false;
var isPlummeting = false;
var gameChar_x; // Game character x position
var gameChar_y; // Game character y position
var floorPos_y; // Floor position
var collectable_x; // Collectable x position
var collectable_y; // Collectable y position
var collectableSize = 20; // Size of the collectable
var collectableIsTaken = false;
var canyon_x = 300; // Canyon x position
var canyon_y; // Canyon y position
var canyon_width = 150; // Canyon width
var canyon_height; // Canyon height
var trees_x; // Array to hold tree x positions
var treePos_y; // Tree y position
var clouds; // Array to hold cloud objects
var mountains; // Array to hold mountain objects
var cameraPosX = 0; // Camera position

function setup() {
    createCanvas(1000, 900); // Canvas size
    floorPos_y = height * 3/4; // Position the floor
    gameChar_x = width / 2; // Game character x position
    gameChar_y = floorPos_y; // Game character y position
    treePos_y = floorPos_y; // Tree y position

    // Initialize tree x positions
    trees_x = [300, 500, 900, 1150];

    // Initialize cloud array with objects
    clouds = [
        {x: 200, y: 100, size: 100},
        {x: 400, y: 150, size: 120},
        {x: 600, y: 80, size: 90}
    ];

    // Initialize mountain array with objects
    mountains = [
        {x: 100, y: floorPos_y, size: 300},
        {x: 500, y: floorPos_y, size: 400},
        {x: 900, y: floorPos_y, size: 350}
    ];

    // Initialize collectable properties
    collectable_x = random(width);
    collectable_y = random(floorPos_y - 100, floorPos_y - 50);
}

function keyPressed() {
    // Handle character movement keys
    if (keyCode === 65) { // 'a' key
        isLeft = true;
    }
    if (keyCode === 68) { // 'd' key
        isRight = true;
    }
    if (keyCode === 87 && !isFalling) { // 'w' key and not already falling
        gameChar_y -= 120; // Jump height of character adjustment
        isFalling = true;
    }
}

function keyReleased() {
    // Handle character stop movement keys
    if (keyCode === 65) { // 'a' key 
        isLeft = false;
    }
    if (keyCode === 68) { // 'd' key 
        isRight = false;
    }
}

function draw() {
    background(100, 155, 255); // Sky color
    
    // Update camera position to keep the character centered
    cameraPosX = gameChar_x - width / 2;
    
    // Apply camera translation
    push();
    translate(-cameraPosX, 0);

    // Draw clouds
    for (var i = 0; i < clouds.length; i++) {
        noStroke();
        fill(178, 203, 242);
        ellipse(clouds[i].x, clouds[i].y, clouds[i].size, clouds[i].size);
        ellipse(clouds[i].x + clouds[i].size * 0.6, clouds[i].y, clouds[i].size * 0.7, clouds[i].size * 0.7);
        ellipse(clouds[i].x - clouds[i].size * 0.6, clouds[i].y, clouds[i].size * 0.7, clouds[i].size * 0.7);
    }

    // Draw mountains
    for (var i = 0; i < mountains.length; i++) {
        fill(150, 150, 150);
        triangle(
            mountains[i].x, mountains[i].y,
            mountains[i].x + mountains[i].size / 2, mountains[i].y - mountains[i].size,
            mountains[i].x + mountains[i].size, mountains[i].y
        );
    }

    // Draw trees
    for (var i = 0; i < trees_x.length; i++) {
        fill(100, 50, 0);
        rect(trees_x[i] - 25, -150 + treePos_y, 50, 150);
        fill(0, 100, 0);
        triangle(
            trees_x[i] - 75, treePos_y - 150,
            trees_x[i], treePos_y - 300,
            trees_x[i] + 75, treePos_y - 150
        );
        triangle(
            trees_x[i] - 100, treePos_y - 75,
            trees_x[i], treePos_y - 225,
            trees_x[i] + 100, treePos_y - 75
        );
    }

    // Draw ground
    noStroke();
    fill(0, 155, 0);
    rect(-100, floorPos_y, width + 400, height - floorPos_y);
    // Draw collectables 
    if (!collectableIsTaken) {
        fill(255, 255, 0);
        ellipse(collectable_x, collectable_y, collectableSize, collectableSize);
    }

    // Draw the canyon
    fill(139, 69, 19);
    rect(canyon_x, canyon_y, canyon_width, canyon_height);
    // Canyon properties 
    canyon_y = floorPos_y;
    canyon_height = height - floorPos_y;

    // Character movement based on key states
    if (isLeft) {
        gameChar_x -= 5; // Move left
    }
    if (isRight) {
        gameChar_x += 5; // Move right
    }

    // Check if character is falling into the canyon
    if (gameChar_x > canyon_x && gameChar_x < canyon_x + canyon_width && gameChar_y == floorPos_y) {
        isPlummeting = true;
    }

    // Adding gravity and falling
    if (gameChar_y < floorPos_y && !isPlummeting) { // Character in the air
        gameChar_y += 2; // Gravity effect 
        isFalling = true;
    } else if (gameChar_y >= floorPos_y && !isPlummeting) { // Character on the ground
        gameChar_y = floorPos_y; // Character stays on the ground
        isFalling = false;
    }

    // If character is plummeting make them fall quickly 
    if (isPlummeting) {
        gameChar_y += 10; // Faster falling speed 
    }
    
    // Draw the game character
    fill(255, 0, 0); // Character color
    rect(gameChar_x - 15, gameChar_y - 55, 30, 50);
    fill(255, 150, 150);
    ellipse(gameChar_x, gameChar_y - 55, 40, 40);
    fill(0);
    rect(gameChar_x - 16, gameChar_y - 10, 10, 10); 
    rect(gameChar_x + 6, gameChar_y - 10, 10, 10);
    fill(0); // Eye color
    ellipse(gameChar_x - 5, gameChar_y - 55, 5, 5); 
    ellipse(gameChar_x + 5, gameChar_y - 55, 5, 5); 
    rect(gameChar_x - 3, gameChar_y - 50, 6, 2); 

    pop(); // End camera translation

    // Check collectable status
    checkCollectable();
    
    console.log("gameChar_x: " + gameChar_x + ", gameChar_y: " + gameChar_y);
}

function checkCollectable() {
    // Distance between game character and collectable
    var d = dist(gameChar_x, gameChar_y, collectable_x, collectable_y);
    
    // Check if character collects the collectable
    if (d < (collectableSize / 2) + 20) { // Adjust collectable collecting distance 
        collectableIsTaken = true;
        
        // Move collectable to random position after being collected
        collectable_x = random(width);
        collectable_y = random(floorPos_y - 100, floorPos_y - 50);
        collectableIsTaken = false; // Reset collectable status
    }
}
