const express = require('express');
const router = express.Router();
const db = require('../db');
const { isLogin } = require('../middlewares/authMiddleware');

// --- [ DAFTAR KERJASAMA (Fitur 2 - Read) ] ---
// Otomatis menangani URL: /kerjasama
router.get('/', isLogin, (req, res) => {
    db.query('SELECT * FROM kerjasama ORDER BY id DESC', (err, results) => {
        res.render('kerjasama/index', { 
            title: 'Data Kerjasama', 
            data: err ? [] : results, 
            user: req.session.user,
            breadcrumbs: [
                { name: 'Dashboard', link: '/dashboard', active: false },
                { name: 'Daftar Kerjasama', link: '/kerjasama', active: true }
            ]
        });
    });
});

module.exports = router;