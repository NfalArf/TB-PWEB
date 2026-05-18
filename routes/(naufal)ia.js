const express = require('express');
const router = express.Router();
const db = require('../db');
const { isLogin } = require('../middlewares/authMiddleware');

// Boilerplate awal agar server tidak crash saat boot.
// Naufal tinggal menaruh rute Fitur 8-16 miliknya di file ini.

module.exports = router;