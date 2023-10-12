const { Course } = require('../models');

class CourseController {

  static async index(req, res) {
    try {
      const courses = await Course.findAll(
        {
          order: [
            ['id', 'asc']
          ]
        }
      );

      res.status(201).json(courses);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async getCourseById(req, res) {
    try {
      const id = +req.params.id;

      const courses = await Course.findByPk(id);

      if (courses) {
        res.status(200).json(courses);
      } else {
        res.status(404).json({ message: 'Course not found' });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async createCourse(req, res) {
    try {
      const { name, desc, image, teacherId, publishDate } = req.body;

      if (!name || !desc || !teacherId || !publishDate) {
        res.status(400).json({ message: 'Semua bidang harus diisi' });
        return;
      }

      const newDate = new Date(publishDate);

      if (isNaN(newDate.getTime())) {
        res.status(400).json({ message: 'Tanggal tidak valid' });
        return;
      }

      const newFormattedDate = newDate.toISOString().split('T')[0];

      const courses = await Course.create({
        name,
        desc,
        image,
        teacherId,
        publishDate: newFormattedDate
      });

      res.status(201).json(courses);
    } catch (error) {
      res.status(500).json(error);
    }
  }


  static async editCourse(req, res) {
    try {
      const id = +req.params.id;

      const { name, desc, image, teacherId, publishDate } = req.body;

      const newDate = new Date(publishDate);

      if (isNaN(newDate.getTime())) {
        req.status(400).json({ message: 'Invalid Data Format' });
      }

      const newFormattedDate = newDate.toISOString().split('T')[0];


      const courses = await Course.update({
        name, desc, image, teacherId, publishDate: newFormattedDate
      }, {
        where: { id }
      });

      if (courses[0] === 1) {
        res.status(201).json({ message: 'Course Updated' });
      } else {
        res.status(404).json({ message: 'Something Wrong' })
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async deleteCourse(req, res) {
    try {
      const id = +req.params.id;

      const courses = await Course.destroy({
        where: { id }
      });

      if (courses === 1) {
        console.log(courses)
        res.status(201).json({ message: 'Course Deleted!' });
      } else {
        res.status(404).json({ message: 'Something Wrong' });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = CourseController;