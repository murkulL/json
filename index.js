import express from 'express';
import jwt from 'jsonwebtoken';

const application = express();

application.use(express.json())

application.get('/', (request, response) => {
    response.send('hello world');
})

application.post("/auth/login", (request, response) => {
    console.log(request.body)

    const token = jwt.sign({
        email: request.body.email,
        password: request.body.password,
        fullName: 'oleg olegov',
    }, 'key123')
    response.json({
        success: true,
        token
    });
});

application.listen(4444, (error) => {
    if(error){
        return console.log(error)
    }
    console.log('server ok');
});