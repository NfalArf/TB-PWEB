const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const { isLogin, isGuest } = require('../middlewares/authMiddleware');

// --- [ PENGALIHAN UTAMA ] ---
router.get('/', (req, res) => res.redirect('/login'));

// --- [ FITUR SIGN UP ] ---
router.get('/signup', isGuest, (req, res) => {
    res.render('signup', { title: 'Daftar Akun Baru', error: null });
});

router.post('/signup', async (req, res) => {
    const name = req.body.name ? req.body.name.trim() : "";
    const email = req.body.email ? req.body.email.trim() : "";
    const password = req.body.password ? req.body.password.trim() : "";

    if (!name || !email || !password) {
        return res.render('signup', { title: 'Daftar Akun Baru', error: 'Semua data wajib diisi!' });
    }

    try {
        db.query('SELECT email FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) return res.status(500).send('Database Error');
            if (results.length > 0) {
                return res.render('signup', { title: 'Daftar Akun Baru', error: 'Email sudah terdaftar!' });
            }

            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
            [name, email, hashedPassword], (err, result) => {
                if (err) return res.status(500).send('Gagal menyimpan data user');

                const newUserId = result.insertId;
                const roleQuery = `
                    INSERT INTO model_has_roles (role_id, model_type, model_id) 
                    VALUES (
                        (SELECT id FROM roles WHERE name = 'user' LIMIT 1),
                        'App\\Models\\User',
                        ?
                    )`;

                db.query(roleQuery, [newUserId], (err) => {
                    if (err) return res.status(500).send('Gagal memberikan role user');
                    res.redirect('/login');
                });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan sistem.');
    }
});

// --- [ SISTEM LOGIN DENGAN BCRYPT ] ---
router.get('/login', isGuest, (req, res) => {
    res.render('login', { title: 'Login', error: null });
});

router.post('/login', (req, res) => {
    const email = req.body.email ? req.body.email.trim() : "";
    const password = req.body.password ? req.body.password.trim() : "";

    if (!email || !password) {
        return res.render('login', { title: 'Login', error: 'Email dan password jangan dikosongin ya!' });
    }

    const query = `
        SELECT u.*, r.name AS role_name 
        FROM users u
        JOIN model_has_roles mhr ON u.id = mhr.model_id
        JOIN roles r ON mhr.role_id = r.id
        WHERE u.email = ?`;

    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).send('Database Error');
        if (results.length === 0) return res.render('login', { title: 'Login', error: 'Email tidak ditemukan.' });

        const user = results[0];

        try {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                req.session.user = { 
                    id: user.id, 
                    name: user.name, 
                    role: user.role_name 
                };
                return req.session.save(() => res.redirect('/dashboard'));
            } else {
                return res.render('login', { title: 'Login', error: 'Password salah!' });
            }
        } catch (e) {
            console.error(e);
            return res.status(500).send('Terjadi kesalahan pada verifikasi.');
        }
    });
});

// --- [ DASHBOARD STATISTIK (Fitur 18) ] ---
router.get('/dashboard', isLogin, (req, res) => {
    db.query('SELECT COUNT(*) AS total FROM kerjasama', (err, results) => {
        const total = (err) ? 0 : results[0].total;
        res.render('dashboard', { 
            title: 'Dashboard', 
            user: req.session.user,
            totalKerjasama: total,
            breadcrumbs: [{ name: 'Dashboard', link: '/dashboard', active: true }]
        });
    });
});

// --- [ LOGOUT ] ---
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

module.exports = router;