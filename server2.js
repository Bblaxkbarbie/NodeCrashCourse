import { createServer } from 'http';
import fs from 'fs/promises';

const PORT = process.env.PORT;

const users = [
    {id: 1, name: 'Taylor Swift'},
    {id: 2, name: 'Justin Bieber'},
    {id: 3, name: 'Megan Fox'},
    {id: 4, name: 'Megan Trainor'},
    {id: 5, name:'Jennifer Lopez'}
];

//Logger middleware
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    //appendFile()
    const appendFile = async () => {
        try {
            await fs.appendFile("./log.txt", `\n${req.method} ${req.url}`);
            console.log("File appended to.....");
        }
        catch (error) {
            console.log(error);
        }
    };

    appendFile()
    next();
}

//JSON middleware
const jsonMiddleware = (req, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    next();
}

//Route handler for GET /api/users
const getUsersHandler = (req, res) => {
    res.write(JSON.stringify(users));
    res.end();
};

//Route handler for GET /api/users/:id
const getUsersByIdHandler = (req, res) => {
    const id = req.url.split('/')[3];
    const user = users.find((user) => user.id === parseInt(id))

    if(user){
        res.write(JSON.stringify(user));
    }
    else{
        res.statusCode = 404
        res.write(JSON.stringify({message: 'User not found'}));
    }

    res.end()
}

//Not found handler
const notFoundHandler = (req, res) => {
    res.statusCode = 404;
    res.write(JSON.stringify({message: 'Route not found'}));
    res.end();
        
}

//Route handler for POST /api/users
const createUserHandler = (req, res) => {
    let body = ''; 

    //Listen for data
    req.on('data', (chunk) => {
        body += chunk.toString();
    })
    req.on('end', () => {
        const newUser = JSON.parse(body);
        users.push(newUser);
        res.statusCode = 201;
        res.write(JSON.stringify(newUser))
        res.end();
    })
}

const server = createServer((req, res) => {
    logger(req, res, () => {
        jsonMiddleware(req, res, () => {
            if (req.url == '/api/users' && req.method === 'GET') {
                getUsersHandler(req, res);
            } else if (req.url.match(/\/api\/users\/([0-9]+)/) && req.method === 'GET') {
                getUsersByIdHandler(req, res);

            } else if (req.url == "/api/users" && req.method === "POST") {
                createUserHandler(req, res)
            } else {
              notFoundHandler(req, res);
            }
        })
    })
})    

server.listen(8000, () => {
    console.log(`Server running on port ${PORT}`)
});
