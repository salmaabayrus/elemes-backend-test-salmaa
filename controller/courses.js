import Courses from "../models/course.model.js";
import cloudinary from "../helper/cloudinary.js";
import db from "../helper/database.js";
import { QueryTypes } from "sequelize";

export const createCourse = async (req, res) => {
  const { title, category, content, price, userId } = req.body;
  const image = req.file.path;
  const uploaded = await cloudinary.uploader.upload(image, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ msg: "Error" });
    }
    return result;
  });
  try {
    await Courses.create({
      title: title,
      category: category,
      image: uploaded.secure_url,
      content: content,
      price: price,
      userId: userId,
    });
    res.status(200).json({ msg: "Course Created" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

export const getCourses = async (req, res) => {
  try {
    const users = await Courses.findAll({
      attributes: ["uuid", "title", "category", "price", "likes"],
    });
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

export const getCourse = async (req, res) => {
  try {
    const course = await Courses.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(course);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

export const updateCourse = async (req, res) => {
  const course = await Courses.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!course) return res.status(404).json({ msg: "Course tidak ditemukan" });
  const { title, category, content, price, userId } = req.body;
  console.log(req.body);
  const image = req.file.path;
  const uploaded = await cloudinary.uploader.upload(image, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ msg: "Error" });
    }
    return result;
  });
  try {
    await Courses.update(
      {
        title: title,
        category: category,
        image: uploaded.secure_url,
        content: content,
        price: price,
        userId: userId,
      },
      {
        where: {
          id: course.id,
        },
      }
    );
    res.status(200).json({ msg: "Course Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

export const deleteCourse = async (req, res) => {
  const course = await Courses.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!course) return res.status(404).json({ msg: "Course tidak ditemukan" });
  try {
    await Courses.destroy({
      where: {
        id: course.id,
      },
    });
    res.status(200).json({ msg: "Course Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

export const getPopularCategory = async (req, res) => {
  try {
    const popularCategory = await Courses.findAll({
      attributes: [
        "category",
        [db.fn("COUNT", db.col("category")), "courseCount"],
      ],
      group: ["category"],
      order: [[db.literal("courseCount"), "DESC"]],
      limit: 1,
    });

    const result =
      popularCategory.length > 0 ? popularCategory[0].category : null;
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

export const getCategories = async (req, res) => {
  try {
    const query = 'SELECT `category` FROM `courses` GROUP BY `category`';
    const categories = await db.query(query, {type: QueryTypes.SELECT});
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

export const searchCourse = async (req, res) => {
  try {
    let orderClause = [];
    if (sortBy === 'highestPrice') {
      orderClause = [['price', 'DESC']];
    } else if (sortBy === 'lowestPrice') {
      orderClause = [['price', 'ASC']];
    } else if (sortBy === 'free') {
      orderClause = [['price', 'ASC']];
    }
    const courses = await Courses.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { content: { [Op.like]: `%${query}%` } },
          { category: { [Op.like]: `%${query}%` } },
        ],
      },
      order: orderClause,
    });
    res.status(200).json(courses);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};