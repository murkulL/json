// import { error } from 'console';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {validationResult} from 'express-validator';
import bcrypt from 'bcrypt';

import {registerValidation}  from './validation/auth.js'

import userModel from './models/user.js';

mongoose.connect(
    'mongodb+srv://oleg:pass@cluster0.kkhilry.mongodb.net/blog?retryWrites=true&w=majority',  
).then(() => console.log('mongoDB Ok'))
.catch((error) => console.log('mongoDB error', error));


const application = express();

application.use(express.json())

application.post("/auth/register", async (request, response) => {
    try {
        const user = await userModel.findOne({ email: request.body.email})

        if(!user){
            return response.status(404).json({
                message: "пользователь не найден",
            });
        }

        const isValidPass = await bcrypt.compare( request.body.password, user._doc.passwordHash);

        if(!isValidPass){
            return request.status(404).json({
                message: 'невереый логин или пароль',
            });
        }

        const token = jwt.sign({
            _id: user._id,
        }, 
        'key123',
        {
            expiresIn: '30d' //время валидности
        }
        );

        const {passwordHash, ...userData} = user._doc;
        response.json({
            ...userData,
            token,
        });
    } catch (error) {
        console.log(error);
        response.status(500).json({
            message: 'не удалось авторизоваться'
        })
    }
})

application.post("/auth/register", registerValidation, async(request, response) => {
    try {
        const errors = validationResult(request);
        if(!errors.isEmpty()){
            return response.status(400).json(errors.array());
        }
    
        const password = request.body.password;
        const salt = await bcrypt.genSalt(10); 
        const hash = await bcrypt.hash(password, salt); 
    
        const documentUserModel = new userModel({
            email: request.body.email,
            fullName: request.body.fullName,
            avatarUrl: request.body.avatarUrl,
            passwordHash : hash,
        });
    
        const user = await documentUserModel.save();

        const token = jwt.sign({
            _id: user._id,

        }, 
        'key123',
        {
            expiresIn: '30d' //время валидности
        }
        );

    const {passwordHash, ...userData} = user._doc;


    response.json({
        ...userData,
        token,
    });
        
    } catch (error) {
        console.log(error);
        response.status(500).json({
            message: 'не удалось зарегистрировать пользователя'
        })
        
    }
});

application.listen(4444, (error) => {
    if(error){
        return console.log(error)
    }
    console.log('server 200 ok');
});