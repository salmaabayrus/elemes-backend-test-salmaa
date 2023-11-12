# Cara penginstalan di local : 
1. npm install
2. buat file .env dengan isi sebagai berikut :
PORT=3000
// DATABASE
DB_NAME='freedb_backend_elemes'
DB_HOST='sql.freedb.tech'
DB_USER='freedb_salmaabyr'
DB_PASSWORD='8z8k&y2n3@!fX4c'
// TOKEN
ACCESS_TOKEN_SECRET='wertyujn36789ijnbgeywu37u2982928329'
REFRESH_TOKEN_SECRET='ftyuik3789widhg3qoskjuwijuii23u3383'
// CLOUDINARY
CLOUD_NAME='dzccfwlku'
API_KEY='128573438996873'
API_SECRET='4dHzTtb4GyUgLzvAkaDcbqiQ2Xk'

# Cara menjalankan program :
npm start

# Cara deploy di Heroku :
1. database di deploy dari https://freedb.tech/
2. menguhubungkan akun github dengan akun heroku
3. membuat git repository
4. menghubungkan git repository yang dipilih ke heroku
5. membuat procfile, penambahan engines pada package.json
6. update perubahan pada repo dengan gti push
7. memasukkan key dan value pada folder .env ke Config Vars heroku
8. restart server heroku (auto/manual)

# LIST API
- api dengan verifyToken membutuhkan token yang dapat diambil dari api login dan token
- api register dapat digunakan untuk role admin dan user
- api dengan adminOnly hanya dapat diakses dari token akun dengan role admin
- contoh akun untuk login yang sudah ada
    admin =
    "email": "Ksalmaa.admin@gmail.com",
    "password": "abcd1234"
    user = 
    "email": "userM@gmail.com",
    "password": "abcd1234"
- terdapat postman collection pada repo ini yang bisa digunakan : Backend Test Elemes.postman_collection.json

// AUTH
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

// USER
router.post('/user', Register);
router.get('/user', verifyToken, adminOnly, getUsers);
router.get('/user/:id', verifyToken, adminOnly, getUser);
router.delete('/user/:id', verifyToken, adminOnly, deleteUser);

// COURSE
router.post('/course', verifyToken, adminOnly, upload.single('image'), createCourse);
router.get('/course', getCourses);
router.get('/course/:id', verifyToken, getCourse);
router.patch('/course/:id', verifyToken, adminOnly, upload.single('image'), updateCourse);
router.delete('/course/:id', verifyToken, adminOnly, deleteCourse);
router.get('/course/categories/popular', getPopularCategory);
router.get('/course/categories', verifyToken, getCategories);
router.get('/course/search', verifyToken, searchCourse);

router.get('/statistics', verifyToken, adminOnly, simpleStatistics);
