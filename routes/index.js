import express from "express";
import upload from "../helper/multer.js";
import { Login, Logout, Register, getUsers, getUser, deleteUser, simpleStatistics } from "../controller/Users.js";
import { createCourse, getCourses, getCourse, updateCourse, deleteCourse, getPopularCategory, getCategories, searchCourse } from "../controller/Courses.js"
import { verifyToken } from "../helper/verify.token.js";
import { adminOnly } from "../helper/admin.only.js";
import { refreshToken } from "../helper/refresh.token.js";

const router = express.Router();

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

export default router;