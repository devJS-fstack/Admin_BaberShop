const express = require('express');
const app = express();
var morgan = require('morgan');
const path = require('path');
require('dotenv').config();
const port = process.env.PORT;

const route = require('./routes/index');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const nameUserMiddle = require('./app/middlewares/NameUserMiddleware')
const serviceMiddle = require('./app/middlewares/ServiceMiddleware');
const { connectData } = require('./util/sequelizedb');
const { sequelize } = require('./util/sequelizedb');
const { QueryTypes } = require('sequelize');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { checkToken, passportMiddle } = require('./app/middlewares/Authentication');

const { google } = require('googleapis');


app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
connectData();
const session = require('express-session');
const store = session.MemoryStore();
app.use(session({
    saveUninitialized: false,
    secret: process.env.KEY_SESSION,
    cookie: {
        maxAge: 1000 * 10 // 10s
    },
    store
}))

app.engine('hbs', handlebars({
    extname: '.hbs',
    helpers: {
        sum: (a, b) => a + b,
    }
}))
app.use(express.urlencoded({
    extended: true,
}));
app.use(express.json());
app.set('view engine', 'hbs');
app.set("views", path.join(__dirname, 'resource/views'));
// app.use(morgan('combined'));
app.locals._user = {
    nameUser: '',
    arr: [],
}

app.locals._userRegis = {
    verifyNumber: 0,
    name: '',
    phone: '',
    email: '',
    password: '',
}
app.locals._service = {
    serviceIds: [],
}

// const { uploadFile } = require('./app/Models/UploadModal')
// uploadFile();
app.use(nameUserMiddle);
app.use(serviceMiddle);
//app.use(checkToken);
//app.use(passportMiddle);
// const multer = require('multer')


// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, './source/public/img')
//     },
//     filename: (req, file, callback) => {
//         console.log(file)
//         callback(null, Date.now() + path.extname(file.originalname))
//     }
// })
// const upload = multer({ storage: storage })


route(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
