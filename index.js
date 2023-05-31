import { error } from 'console';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {validationResult} from 'express-validator';
import bcrypt from 'bcrypt';

import {registerValidation}  from './validation/auth.js'

import userModel from './models/user.js';

mongoose.connect(
    'mongodb+srv://oleg:pass@cluster0.kkhilry.mongodb.net/?retryWrites=true&w=majority',  
).then(() => console.log('mongoDB Ok'))
.catch((error) => console.log('mongoDB error', error));


const application = express();

application.use(express.json())

application.post("/auth/register", registerValidation, async (request, response) => {
    const errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(400).json(errors.array());
    }

    const password = request.body.password; //получаем пароль из тела request
    const salt = await bcrypt.genSalt(10); // метод шифровки  
    const passwordHash = await bcrypt.hash(password, salt); //передаем пароль и шифруем 

    const documentUserModel = new userModel({
        email: request.body.email,
        fullName: request.body.fullName,
        avatarUrl: request.body.avatarUrl,
        passwordHash,
    });

    const user = await documentUserModel.save();
    response.json(user);
});

application.listen(4444, (error) => {
    if(error){
        return console.log(error)
    }
    console.log('server 200 ok');
});