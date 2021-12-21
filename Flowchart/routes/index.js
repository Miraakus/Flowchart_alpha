const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const {ensureAuthenticated} = require('../config/auth');
const { teacherGet, teacherPost, learnerGet, learnerPost, Reference } = require("../app/Controllers/ChartController");
const router = require('express').Router();

router.get('/auth', (req, res) => res.render('welcome'));
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard', {name:req.user.name}));

router.get('/teacher1', ensureAuthenticated, function (req, res) { 
   teacherGet(req, res, 1);
});

router.post('/teacher1', urlencodedParser, function (req, res) {
    teacherPost(req, res, 1);
});

router.get('/learner1', ensureAuthenticated, function (req, res) {
   learnerGet(req, res, 1);
});

router.post('/learner1', urlencodedParser, function (req, res) {
   learnerPost(req, res, 1);
});

router.get('/reference1', ensureAuthenticated, function (req, res) {
   Reference(req, res, 1);   
});


router.get('/teacher2', ensureAuthenticated, function (req, res) { 
   teacherGet(req, res, 2);
});

router.post('/teacher2', urlencodedParser, function (req, res) {
    teacherPost(req, res, 2);
});

router.get('/learner2', ensureAuthenticated, function (req, res) {
   learnerGet(req, res, 2);
});

router.post('/learner2', urlencodedParser, function (req, res) {
   learnerPost(req, res, 2);
});

router.get('/reference2', ensureAuthenticated, function (req, res) {
   Reference(req, res, 2);   
});


router.get('/teacher3', ensureAuthenticated, function (req, res) { 
   teacherGet(req, res, 3);
});

router.post('/teacher3', urlencodedParser, function (req, res) {
    teacherPost(req, res, 3);
});

router.get('/learner3', ensureAuthenticated, function (req, res) {
   learnerGet(req, res, 3);
});

router.post('/learner3', urlencodedParser, function (req, res) {
   learnerPost(req, res, 3);
});

router.get('/reference3', ensureAuthenticated, function (req, res) {
   Reference(req, res, 3);   
});
router.get('/teacher4', ensureAuthenticated, function (req, res) { 
   teacherGet(req, res, 4);
});

router.post('/teacher4', urlencodedParser, function (req, res) {
    teacherPost(req, res, 4);
});

router.get('/learner4', ensureAuthenticated, function (req, res) {
   learnerGet(req, res, 4);
});

router.post('/learner4', urlencodedParser, function (req, res) {
   learnerPost(req, res, 4);
});

router.get('/reference4', ensureAuthenticated, function (req, res) {
   Reference(req, res, 4);   
});


router.get('/teacher5', ensureAuthenticated, function (req, res) { 
   teacherGet(req, res, 5);
});

router.post('/teacher5', urlencodedParser, function (req, res) {
    teacherPost(req, res, 5);
});

router.get('/learner5', ensureAuthenticated, function (req, res) {
   learnerGet(req, res, 5);
});

router.post('/learner5', urlencodedParser, function (req, res) {
   learnerPost(req, res, 5);
});

router.get('/reference5', ensureAuthenticated, function (req, res) {
   Reference(req, res, 5);   
});


router.get('/teacher6', ensureAuthenticated, function (req, res) { 
   teacherGet(req, res, 6);
});

router.post('/teacher6', urlencodedParser, function (req, res) {
    teacherPost(req, res, 6);
});

router.get('/learner6', ensureAuthenticated, function (req, res) {
   learnerGet(req, res, 6);
});

router.post('/learner6', urlencodedParser, function (req, res) {
   learnerPost(req, res, 6);
});

router.get('/reference6', ensureAuthenticated, function (req, res) {
   Reference(req, res, 6);   
});


router.get('/teacher7', ensureAuthenticated, function (req, res) { 
   teacherGet(req, res, 7);
});

router.post('/teacher7', urlencodedParser, function (req, res) {
    teacherPost(req, res, 7);
});

router.get('/learner7', ensureAuthenticated, function (req, res) {
   learnerGet(req, res, 7);
});

router.post('/learner7', urlencodedParser, function (req, res) {
   learnerPost(req, res, 7);
});

router.get('/reference7', ensureAuthenticated, function (req, res) {
   Reference(req, res, 7);   
});


router.get('/teacher8', ensureAuthenticated, function (req, res) { 
   teacherGet(req, res, 8);
});

router.post('/teacher8', urlencodedParser, function (req, res) {
    teacherPost(req, res, 8);
});

router.get('/learner8', ensureAuthenticated, function (req, res) {
   learnerGet(req, res, 8);
});

router.post('/learner8', urlencodedParser, function (req, res) {
   learnerPost(req, res, 8);
});

router.get('/reference8', ensureAuthenticated, function (req, res) {
   Reference(req, res, 8);   
});


router.get('/teacher9', ensureAuthenticated, function (req, res) { 
   teacherGet(req, res, 9);
});

router.post('/teacher9', urlencodedParser, function (req, res) {
    teacherPost(req, res, 9);
});

router.get('/learner9', ensureAuthenticated, function (req, res) {
   learnerGet(req, res, 9);
});

router.post('/learner9', urlencodedParser, function (req, res) {
   learnerPost(req, res, 9);
});

router.get('/reference9', ensureAuthenticated, function (req, res) {
   Reference(req, res, 9);   
});


router.get('/teacher10', ensureAuthenticated, function (req, res) { 
   teacherGet(req, res, 10);
});

router.post('/teacher10', urlencodedParser, function (req, res) {
    teacherPost(req, res, 10);
});

router.get('/learner10', ensureAuthenticated, function (req, res) {
   learnerGet(req, res, 10);
});

router.post('/learner10', urlencodedParser, function (req, res) {
   learnerPost(req, res, 10);
});

router.get('/reference10', ensureAuthenticated, function (req, res) {
   Reference(req, res, 10);   
});
router.get('/teacher11', ensureAuthenticated, function (req, res) { 
   teacherGet(req, res, 11);
});

router.post('/teacher11', urlencodedParser, function (req, res) {
    teacherPost(req, res, 11);
});

router.get('/learner11', ensureAuthenticated, function (req, res) {
   learnerGet(req, res, 11);
});

router.post('/learner11', urlencodedParser, function (req, res) {
   learnerPost(req, res, 11);
});

router.get('/reference11', ensureAuthenticated, function (req, res) {
   Reference(req, res, 11);   
});


router.get('/teacher12', ensureAuthenticated, function (req, res) { 
   teacherGet(req, res, 12);
});

router.post('/teacher12', urlencodedParser, function (req, res) {
    teacherPost(req, res, 12);
});

router.get('/learner12', ensureAuthenticated, function (req, res) {
   learnerGet(req, res, 12);
});

router.post('/learner12', urlencodedParser, function (req, res) {
   learnerPost(req, res, 12);
});

router.get('/reference12', ensureAuthenticated, function (req, res) {
   Reference(req, res, 12);   
});


router.get('/teacher13', ensureAuthenticated, function (req, res) { 
   teacherGet(req, res, 13);
});

router.post('/teacher13', urlencodedParser, function (req, res) {
    teacherPost(req, res, 13);
});

router.get('/learner13', ensureAuthenticated, function (req, res) {
   learnerGet(req, res, 13);
});

router.post('/learner13', urlencodedParser, function (req, res) {
   learnerPost(req, res, 13);
});

router.get('/reference13', ensureAuthenticated, function (req, res) {
   Reference(req, res, 13);   
});


router.get('/teacher14', ensureAuthenticated, function (req, res) { 
   teacherGet(req, res, 14);
});

router.post('/teacher14', urlencodedParser, function (req, res) {
    teacherPost(req, res, 14);
});

router.get('/learner14', ensureAuthenticated, function (req, res) {
   learnerGet(req, res, 14);
});

router.post('/learner1', urlencodedParser, function (req, res) {
   learnerPost(req, res, 14);
});

router.get('/reference14', ensureAuthenticated, function (req, res) {
   Reference(req, res, 14);   
});


router.get('/teacher15', ensureAuthenticated, function (req, res) { 
   teacherGet(req, res, 15);
});

router.post('/teacher15', urlencodedParser, function (req, res) {
    teacherPost(req, res, 15);
});

router.get('/learner15', ensureAuthenticated, function (req, res) {
   learnerGet(req, res, 15);
});

router.post('/learner15', urlencodedParser, function (req, res) {
   learnerPost(req, res, 15);
});

router.get('/reference15', ensureAuthenticated, function (req, res) {
   Reference(req, res, 15);   
});


router.get('/teacher16', ensureAuthenticated, function (req, res) { 
   teacherGet(req, res, 16);
});

router.post('/teacher16', urlencodedParser, function (req, res) {
    teacherPost(req, res, 16);
});

router.get('/learner16', ensureAuthenticated, function (req, res) {
   learnerGet(req, res, 16);
});

router.post('/learner16', urlencodedParser, function (req, res) {
   learnerPost(req, res, 16);
});

router.get('/reference16', ensureAuthenticated, function (req, res) {
   Reference(req, res, 16);   
});


router.get('/teacher17', ensureAuthenticated, function (req, res) { 
   teacherGet(req, res, 17);
});

router.post('/teacher17', urlencodedParser, function (req, res) {
    teacherPost(req, res, 17);
});

router.get('/learner17', ensureAuthenticated, function (req, res) {
   learnerGet(req, res, 17);
});

router.post('/learner17', urlencodedParser, function (req, res) {
   learnerPost(req, res, 17);
});

router.get('/reference17', ensureAuthenticated, function (req, res) {
   Reference(req, res, 17);   
});


router.get('/teacher18', ensureAuthenticated, function (req, res) { 
   teacherGet(req, res, 18);
});

router.post('/teacher18', urlencodedParser, function (req, res) {
    teacherPost(req, res, 18);
});

router.get('/learner18', ensureAuthenticated, function (req, res) {
   learnerGet(req, res, 18);
});

router.post('/learner18', urlencodedParser, function (req, res) {
   learnerPost(req, res, 18);
});

router.get('/reference18', ensureAuthenticated, function (req, res) {
   Reference(req, res, 18);   
});


router.get('/teacher19', ensureAuthenticated, function (req, res) { 
   teacherGet(req, res, 19);
});

router.post('/teacher19', urlencodedParser, function (req, res) {
    teacherPost(req, res, 19);
});

router.get('/learner19', ensureAuthenticated, function (req, res) {
   learnerGet(req, res, 19);
});

router.post('/learner19', urlencodedParser, function (req, res) {
   learnerPost(req, res, 19);
});

router.get('/reference19', ensureAuthenticated, function (req, res) {
   Reference(req, res, 19);   
});


router.get('/teacher20', ensureAuthenticated, function (req, res) { 
   teacherGet(req, res, 20);
});

router.post('/teacher20', urlencodedParser, function (req, res) {
    teacherPost(req, res, 20);
});

router.get('/learner20', ensureAuthenticated, function (req, res) {
   learnerGet(req, res, 20);
});

router.post('/learner20', urlencodedParser, function (req, res) {
   learnerPost(req, res, 20);
});

router.get('/reference20', ensureAuthenticated, function (req, res) {
   Reference(req, res, 20);   
});


router.get('/teacher21', ensureAuthenticated, function (req, res) { 
   teacherGet(req, res, 21);
});

router.post('/teacher21', urlencodedParser, function (req, res) {
    teacherPost(req, res, 21);
});

router.get('/learner21', ensureAuthenticated, function (req, res) {
   learnerGet(req, res, 21);
});

router.post('/learner21', urlencodedParser, function (req, res) {
   learnerPost(req, res, 21);
});

router.get('/reference21', ensureAuthenticated, function (req, res) {
   Reference(req, res, 21);   
});

module.exports = router