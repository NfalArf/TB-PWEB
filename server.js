const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./db'); // Pastikan koneksi DB kamu sudah benar

// 1. IMPORT RUTE MODULAR (Menggantikan const router = require('./routes'))
const kerjasamaRouter = require('./routes/(dwigo)kerjasama');
const iaRouter = require('./routes/(naufal)ia');
const perpanjanganRouter = require('./routes/(ghozi)perpanjangan');

const app = express();

// SETTINGS & TEMPLATE ENGINE
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// BODY PARSER 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// KONFIGURASI SESSION 
app.use(session({
    secret: 'kerjasama_fti_unand_2024', 
    resave: false,
    saveUninitialized: false, 
    cookie: { 
        secure: false, 
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 
    }
}));

// GLOBAL VARIABLE MIDDLEWARE
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// 5. MOUNT ROUTER MODULAR (Dipisah per penanggung jawab)
app.use('/kerjasama', kerjasamaRouter); // Fitur 1-7 (Dwigo)
app.use('/ia', iaRouter);               // Fitur 8-16 (Naufal)
app.use('/', perpanjanganRouter);       // Fitur 17-25 + Auth Login/Signup (Ghozi)

// START SERVER
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`...........................................`);
    console.log(`Sistem Kerjasama FTI Berjalan di Port ${PORT}`);
    console.log(`Link: http://localhost:${PORT}`);
    console.log(`...........................................`);
});