var express = require('express'),
    router  = express.Router();


router.get('/admin', function(req,res) {
    res.render('admin');
});


module.exports = router;