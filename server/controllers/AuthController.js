require('dotenv').config();
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const secretKey = process.env.SECRET_KEY;

class AuthController {
  static async getUser(req, res) {
    try {
      const user = await User.findAll();
      res.json(user);
    } catch (error) {
      res.json(error)
    }
  }
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (user) {
        const hashPassword = await bcrypt.compare(password, user.password);

        if (hashPassword) {

          if (!secretKey) {
            return res.status(500).json({ message: 'Internal server error: Secret key is missing.' });
          }

          const token = jwt.sign(
            {
              id: user.id,
              email: user.email,
              userType: user.usertype
            },
            secretKey
          );

          res.status(200).json({
            message: 'Login successful',
            token,
            userType: user.usertype
          });
        } else {
          res.status(401).json({ message: 'Invalid password' });
        }
      } else {
        res.status(401).json({ message: 'Email not found' });
      }
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ message: 'An internal server error occurred.' });
    }
  }

  static async registerInput(req, res) {
    try {
      // console.log('request body:', req.body);
      const { fullname, bio, image, email, password, usertype } = req.body;
      // console.log('image:', image);

      let user = await User.create({
        fullname, bio, image, email, password, usertype
      });

      // console.log('masuk');

      res.status(201).json(user.toJSON());
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static getId(req, res) {
    try {
      // console.log('masuk', req.query);
      const token = req.query.token;

      if (token === null || token === 'false') {
        res.status(401).json({ message: 'You must login first.' });
      }

      const decoded = jwt.verify(token, secretKey);
      // console.log('decoded:', decoded);

      res.status(200).json(decoded);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async editProfile(req, res) {
    try {
      const id = +req.params.id;

      const user = await User.findOne({
        where: { id }
      });

      let { fullname, bio, image } = req.body;

      let i = 0;

      if (fullname === null || fullname === "") {
        fullname = user.fullname;
        i++;
      }
      if (bio === null || bio === "") {
        bio = user.bio;
        i++;
      }
      if (image === null || image === "") {
        image = user.image;
        i++;
      }

      if (i === 3) {
        res.status(404).json({ message: 'At least one field is filled.' });
        return;
      }

      const newUser = await User.update({ fullname, bio, image }, {
        where: { id }
      });

      if (newUser[0] === 1) {
        res.status(201).json({ message: 'Profile updated' });
      } else {
        res.status(404).json({ message: 'Update failed' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Something wrong' });
    }
  }

  static async editPassword(req, res) {
    try {
      const id = +req.params.id;

      const { oldpassword, newpassword } = req.body;

      const user = await User.findOne({
        where: { id }
      });

      const checkPass = await bcrypt.compare(oldpassword, user.password);
      console.log('check:', checkPass);
      if (checkPass) {
        if (oldpassword === newpassword) {
          res.status(404).json({
            message: 'Old and new password must differ.'
          });
          return;
        }

        if (newpassword === '' || newpassword === null) {
          res.status(404).json({
            message: 'New password cannot null.'
          });
          return;
        }


        const updatedUser = await User.update({
          password: bcrypt.hashSync(newpassword, 5)
        }, {
          where: { id }
        });

        if (updatedUser[0] === 1) {
          res.status(201).json({ message: 'Password updated' });
        } else {
          res.status(404).json({ message: 'Update password failed' });
        }
      } else {
        res.status(404).json({ message: 'Old password is false' });
      }
    } catch (error) {
      res.status(500).json({ message: 'All field must filled in' });
    }
  }
}

module.exports = AuthController;