const bcrypt = require("bcryptjs");
const passport = require('passport');
const User = require("../Models/User");
require("tls").DEFAULT_MIN_VERSION = "TLSv1";
const { transporter } = require("../Middlewares/mailer");

class UserController {
  static async register(request, response) {
   const { name, email, password, confirm_password } = request.body;
    let errors = [];
    if(!name || !email || !password || !confirm_password){
        errors.push({msg:'Please fill in all the fields'});
    }
    if(password !== confirm_password){
        errors.push({msg:'Passwords do not match'});
    }
    if(password.length < 6){
        errors.push({msg:'Passwords must be at least 6 characters long'});
    }
    if(errors.length > 0){
        response.render('register', {
            errors,
            name,
            email,
            password,
            confirm_password
        })
    }
    else{
            const hashPassword = await bcrypt.hash(password, 10);
            const checkUsername = await User.findOne({ where: { name }}).catch(error => {
                response.json({ error });
            });
            if(checkUsername){
                errors.push({msg:'Email already registered'});
                response.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    confirm_password
                })
            }
            else{
                // Hash password
                await User.create({ name, email, password: hashPassword }).catch(error => {
                    response.json({ error });
                });
                request.flash('success_msg', 'You are registered.') 
                response.redirect('/users/login')
            }  
    }    
  }

  static async login(request, response, next){
   await passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true 
    })(request, response, next)
}

  static async logout(request, response){
   await request.logout();
   await request.flash('success_msg','You are logged out');
   await response.redirect('/users/login')
}
  
  static async contact(request, response) {
    let { name, email, subject, message } = request.body;
    if (!name || !email || !message) {
      return response.json({
        msg: "Name, email and a message is required",
        error: true
      });
    }
    if (!subject) {
      subject = "Enquiry";
    }

    const mailData = {
      from: email,
      to: "vladislav.lukashov.120@gmail.com",
      subject,
      template: "contact",
      context: {
        name,
        message
      }
    };

    try {
      await transporter.sendMail(mailData);
      response.json({
        msg: "Message sent successful, we reply you within the next few hours",
        error: false
      });
    } catch (error) {
      response.json({
        msg: `Couldn't send a mail to us, try again later`,
        error: true
      });
    }
  }
}
module.exports = UserController;