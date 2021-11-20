const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { models } = require('../sequelize');
const bcrypt = require('bcrypt');

const jwtSecret = 'Zv3SNmakJYZP9JTKzCOfmoNmxgv36Vp0g0csh6LSLMf543iQSfxC161wCQxUisR';
const expireTime = 1000*3000; //  50 minutes
const authErrorObj = { errors: [{  'param': 'Server', 'msg': 'Authorization error' }] };

const routes = {
    order: require('./routes/order'),
    product: require('./routes/product'),
    client: require('./routes/client'),
    employee: require('./routes/employee'),
    wallet: require('./routes/wallet'),
};

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const checkPassword = (user,password) => bcrypt.compareSync(password, user.hash);

// Authentication endpoint
app.post('/api/login', async (req, res) =>
    await models.user.findOne({where: {email: req.body.email}})
        .then(async user => {
            if (!user) {
                res.status(404).send({errors: [{'param': 'Server', 'msg': 'Invalid e-mail'}]});
            } else {
                if (!checkPassword(user.password,req.body.password)) {
                    res.status(401).send({errors: [{'param': 'Server', 'msg': 'Wrong password'}]});
                }else{
                    //AUTHENTICATION SUCCESS
                    const token = jsonwebtoken.sign({user: user.id}, jwtSecret, {expiresIn: expireTime});
                    res.cookie('token', token, {httpOnly: true, sameSite: true, maxAge: expireTime});
                    res.json({id: user.id, name: user.name});
                }
            }
        }).catch(
            // Delay response when wrong user/pass is sent to avoid fast guessing attempts
            err => new Promise(resolve => {
                setTimeout(resolve, 1000)
            }).then(() => res.status(401).json(authErrorObj))
        ));

app.use(cookieParser());
app.post('/api/logout', (req, res) => res.clearCookie('token').end());

// // For the rest of the code, all APIs require authentication
// app.use(jwt({
//     secret: jwtSecret,
//     getToken: req => req.cookies.token
// }));

// To return a better object in case of errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json(authErrorObj);
    }
});

function makeHandlerAwareOfAsyncErrors(handler) {
    return async function (req, res, next) {
        try {
            await handler(req, res);
        } catch (error) {
            next(error);
        }
    };
}

for (const [routeName, routeController] of Object.entries(routes)) {
    if (routeController.getAll) {
        app.get(
            `/api/${routeName}`,
            makeHandlerAwareOfAsyncErrors(routeController.getAll)
        );
    }
    if (routeController.getById) {
        app.get(
            `/api/${routeName}/:id`,
            makeHandlerAwareOfAsyncErrors(routeController.getById)
        );
    }
    if (routeController.create) {
        app.post(
            `/api/${routeName}`,
            makeHandlerAwareOfAsyncErrors(routeController.create)
        );
    }
    if (routeController.update) {
        app.put(
            `/api/${routeName}/:id`,
            makeHandlerAwareOfAsyncErrors(routeController.update)
        );
    }
    if (routeController.remove) {
        app.delete(
            `/api/${routeName}/:id`,
            makeHandlerAwareOfAsyncErrors(routeController.remove)
        );
    }
}

module.exports = app;
