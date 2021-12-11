const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { models } = require('../sequelize');
const bcrypt = require('bcrypt');
const {reminder} = require("./routes/order");

const jwtSecret = 'Zv3SNmakJYZP9JTKzCOfmoNmxgv36Vp0g0csh6LSLMf543iQSfxC161wCQxUisR';
const expireTime = 1000 * 3000; //  50 minutes
const authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };

const routes = {
    order: require('./routes/order'),
    product: require('./routes/product'),
    client: require('./routes/client'),
    employee: require('./routes/employee'),
    wallet: require('./routes/wallet'),
    farmer: require('./routes/farmer'),
};

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// const checkPassword = (user, password) => bcrypt.compareSync(password, user.hash);
const checkPassword = (user, password) => user === password;

// Authentication endpoint
app.post('/api/login', async (req, res) =>
    await models.user.findOne({ where: { email: req.body.email } })
        .then(async user => {
            if (!user) {
                res.status(404).send({ errors: [{ 'param': 'Server', 'msg': 'Invalid e-mail' }] });
            } else {
                if (!checkPassword(user.password, req.body.password)) {
                    res.status(401).send({ errors: [{ 'param': 'Server', 'msg': 'Wrong password' }] });
                } else {
                    //AUTHENTICATION SUCCESS
                    const tmp = {
                        id: user.id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        role: user.role,
                        is_tmp_password: user.is_tmp_password
                    }
                    const token = jsonwebtoken.sign({ user: tmp }, jwtSecret, { expiresIn: expireTime });
                    res.cookie('token', token, { httpOnly: true, sameSite: true, maxAge: expireTime });
                    res.json({ id: user.id, firstname: user.firstname, lastname: user.lastname, role: user.role, is_tmp_password: user.is_tmp_password });
                }
            }
        }).catch(
            // Delay response when wrong user/pass is sent to avoid fast guessing attempts
            err => new Promise(resolve => {
                setTimeout(resolve, 1000)
            }).then(() => res.status(401).json(authErrorObj))
        ));

app.use(cookieParser());
app.post('/api/logout', (req, res) => {
    res.cookie('token', { expires: Date.now() });
    return res.status(200).json({});
});

/**
* Check Authentication
* 
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
const checkAuth = (req, res, next) => {
    const token = req.cookies.token;

    if (token === null || token === undefined)
        return res.status(401).json({ status: 'failed' });

    jsonwebtoken.verify(token, jwtSecret, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ status: 'failed' });
        }

        return res.status(200).json({ status: 'success', data: user });
    })
}
app.post('/api/auth', checkAuth);

/**
 * TO-DO: reset password
 */

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

app.post('/api/order/:id/reminder', reminder)

module.exports = app;
