import Courses from "../models/course.model.js";
import cloudinary from "../helper/cloudinary.js";
import db from "../helper/database.js";

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

export const getCategories = async (req, res) => {
  try {
    const categories = await Courses.findAll({
      attributes: ["category"],
      group: ["category"],
    });
    const result = categories.map((course) => course.category);
    res.status(200).json(result);
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

export const searchCourse = async (req, res) => {
  const { sortBy, searchTerm } = req.query;
  try {
    let order;
    switch (sortBy) {
      case "lowest-price":
        order = [["price", "ASC"]];
        break;
      case "highest-price":
        order = [["price", "DESC"]];
        break;
      case "free-price":
        order = [["price", "ASC"]];
        break;
      default:
        order = [["createdAt", "DESC"]]; // Default sorting, you can change this
        break;
    }

    const whereClause = {};
    if (searchTerm) {
      whereClause.title = {
        [sequelize.Op.like]: `%${searchTerm}%`,
      };
      whereClause.content = {
        [sequelize.Op.like]: `%${searchTerm}%`,
      };
      whereClause.category = {
        [sequelize.Op.like]: `%${searchTerm}%`,
      };
    }

    const result = await Courses.findAll({
      where: whereClause,
      order,
    });

    if (result.length === 0) {
      return res.status(404).json({ msg: "No courses found matching the criteria." });
    };
    
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};
