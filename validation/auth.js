import { body } from 'express-validator'; //проверяем в теле запроса

export const registerValidation = [
    body('email', 'неверный формат почты').isEmail(),//проверка на мыло 
    body('password', 'пароль должен быть минимум 5 символов').isLength({ min: 5}),
    body('fullName', 'укажите имя',).isLength({ min: 3 }),
    body('avatarUrl', 'неверная ссылка на аватар').optional().isURL(),//Когда значение обернуто в Optional, это означает, что оно может присутствовать (не являться пустым) или отсутствовать (быть пустым).


];
 
//.isURL() проверят ,является ли это ссылка или нет 