const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json());


function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log('inside', authHeader);
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'forbidden' });
        }
        req.decoded = decoded;
        next();

    })
}

app.post('/login', (req, res) => {
    const user = req.body;
    if (user.email === 'abc@def.com' && user.password === '123456') {
        const token = jwt.sign(
            { email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10s' });
        res.send({
            success: true,
            accessToken: token
        })
    }
    else {
        res.send({ success: false });
    }

});


// app.get('/orders', (req, res) => {
//     res.send([{ id: 1, item: 'sunglass' }, { id: 2, item: 'moonglass' }]);
// });

app.get('/getorders', verifyJWT, (req, res) => {
    res.send([{ id: 1, item: 'sunglass' }, { id: 2, item: 'moonglass' }]);
});

app.get('/', (req, res) => {
    res.send('simple jwt server running successfully');
});

app.listen(port, () => {
    console.log('server is running on the port', port);
})