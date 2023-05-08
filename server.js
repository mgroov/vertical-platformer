//library imports 
const mongoose = require('mongoose')
const path = require('path');

// mongoose.connect('mongodb://127.0.0.1:27017/schedule').then(() => {
//   console.log(`successfully connected`);
// }).catch((e) => {
//   console.log(`not connected`);
// }); 

// db = mongoose.connection

// //if error occurs print
// db.on('error',(error)=> console.error(error))
// db.once('open',()=> console.log('Connected to Database'))

const http = require("http");
const fs = require('fs').promises;

const host = 'localhost';
const port = 8000;

let indexFile;
let players;
let collisionblocks;
let collisons;
let utils;
let index; 
let sprite;


    fs.readFile(__dirname + "/js/classes/Sprite.js")
    .then(contents => {
        sprite = contents;
    })
    .catch(err => {
        console.error(`Could not read index.js file: ${err}`);
        process.exit(1);
    });


    fs.readFile(__dirname + "/js/classes/Player.js")
    .then(contents => {
        players = contents;
    })
    .catch(err => {
        console.error(`Could not read player.js file: ${err}`);
        process.exit(1);
    });


    fs.readFile(__dirname + "/js/utils.js")
    .then(contents => {
        utils = contents;
    })
    .catch(err => {
        console.error(`Could not read utils.js file: ${err}`);
        process.exit(1);
    });


    fs.readFile(__dirname + "/js/data/collisions.js")
    .then(contents => {
        collisons = contents;
    })
    .catch(err => {
        console.error(`Could not read collisions.js file: ${err}`);
        process.exit(1);
    });

    fs.readFile(__dirname + "/js/classes/CollisionBlock.js")
    .then(contents => {
        collisionblocks = contents;
    })
    .catch(err => {
        console.error(`Could not read CB.js file: ${err}`);
        process.exit(1);
    });

    

    fs.readFile(__dirname + "/index.js")
    .then(contents => {
        index = contents;
    })
    .catch(err => {
        console.error(`Could not read index.js file: ${err}`);
        process.exit(1);
    });

    fs.readFile(__dirname + "/index.html")
    .then(contents => {
        indexFile = contents;
    })
    .catch(err => {
        console.error(`Could not read index.html file: ${err}`);
        process.exit(1);
    });

//image loader
let Jump;

fs.readFile(__dirname + "/img/warrior/Jump.png")
    .then(contents => {
        Jump = contents;
    })
    .catch(err => {
        console.error(`Could not read index.html file: ${err}`);
        process.exit(1);
    });

    let jumpLeft;

    fs.readFile(__dirname + "/img/warrior/JumpLeft.png")
        .then(contents => {
            jumpLeft = contents;
        })
        .catch(err => {
            console.error(`Could not read index.html file: ${err}`);
            process.exit(1);
        });    

let Run;

fs.readFile(__dirname + "/img/warrior/Run.png")
    .then(contents => {
        Run = contents;
    })
    .catch(err => {
        console.error(`Could not read index.html file: ${err}`);
        process.exit(1);
    });

let fall;

fs.readFile(__dirname + "/img/warrior/Fall.png")
    .then(contents => {
        fall = contents;
    })
    .catch(err => {
        console.error(`Could not read index.html file: ${err}`);
        process.exit(1);
    });

let fallL;

fs.readFile(__dirname + "/img/warrior/FallLeft.png")
    .then(contents => {
        fallL = contents;
    })
    .catch(err => {
        console.error(`Could not read index.html file: ${err}`);
        process.exit(1);
    });

let RunLeft;

fs.readFile(__dirname + "/img/warrior/RunLeft.png")
    .then(contents => {
        RunLeft = contents;
    })
    .catch(err => {
        console.error(`Could not read index.html file: ${err}`);
        process.exit(1);
    });

let IdleLeft; 

fs.readFile(__dirname + "/img/warrior/IdleLeft.png")
    .then(contents => {
        IdleLeft = contents;
    })
    .catch(err => {
        console.error(`Could not read index.html file: ${err}`);
        process.exit(1);
    });

let idle;

fs.readFile(__dirname + "/img/warrior/Idle.png")
    .then(contents => {
        idle = contents;
    })
    .catch(err => {
        console.error(`Could not read index.html file: ${err}`);
        process.exit(1);
    });

    let background;

fs.readFile(__dirname + "/img/Background.png")
    .then(contents => {
        background = contents;
    })
    .catch(err => {
        console.error(`Could not read index.html file: ${err}`);
        process.exit(1);
    });
    
const requestListener = function (req, res) {
    
    switch (req.url) {
        case "/":
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(indexFile);
            break
        case "/js/classes/Player.js":
            res.setHeader("Content-Type", "text/javascript");
            res.writeHead(200);
            res.end(players);
            break
        case "/js/utils.js":
            res.setHeader("Content-Type", "text/javascript");
            res.writeHead(200);
            res.end(utils);
            break
        case "/js/data/collisions.js":
            res.setHeader("Content-Type", "text/javascript");
            res.writeHead(200);
            res.end(collisons);
            break
        case "/js/classes/Sprite.js":
            res.setHeader("Content-Type", "text/javascript");
            res.writeHead(200);
            res.end(sprite);
            break
        case "/js/classes/CollisionBlock.js":
            res.setHeader("Content-Type", "text/javascript");
            res.writeHead(200);
            res.end(collisionblocks);
            break
        case "/index.js":
            res.setHeader("Content-Type", "text/javascript");
            res.writeHead(200);
            res.end(index);
            break
        case "/img/warrior/Jump.png":
            res.setHeader("Content-Type", "image/png");
            res.writeHead(200);
            res.end(Jump);
            break
        case "/img/warrior/JumpLeft.png":
            res.setHeader("Content-Type", "image/png");
            res.writeHead(200);
            res.end(jumpLeft);
            break    
        case "/img/warrior/Run.png":
            res.setHeader("Content-Type", "image/png");
            res.writeHead(200);
            res.end(Run);
            break
        case "/img/warrior/RunLeft.png":
            res.setHeader("Content-Type", "image/png");
            res.writeHead(200);
            res.end(RunLeft);
            break
        case "/img/warrior/Fall.png":
            res.setHeader("Content-Type", "image/png");
            res.writeHead(200);
            res.end(fall);
            break
        case "/img/warrior/FallLeft.png":
            res.setHeader("Content-Type", "image/png");
            res.writeHead(200);
            res.end(fallL);
            break  
        case "/img/warrior/Idle.png":
            res.setHeader("Content-Type", "image/png");
            res.writeHead(200);
            res.end(idle);
            break
        case "/img/warrior/IdleLeft.png":
            res.setHeader("Content-Type", "image/png");
            res.writeHead(200);
            res.end(IdleLeft);
            break    

        case "/img/background.png":
            res.setHeader("Content-Type", "image/png");
            res.writeHead(200);
            res.end(background);
            break                 
        default:
            res.writeHead(404);
            res.end(JSON.stringify({error:"Resource not found"}));
    }

};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

