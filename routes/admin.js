var express = require('express'),
    router  = express.Router();


router.get('/admin', function(req,res) {
    res.render('admin');
});

router.post('/admin/edit', function(req,res) {
    if(req.body.category) {
       res.redirect('/'+ req.body.category +'/edit');
    }
    else {
        res.redirect('/'+ req.body.category2 + '/' + req.body.subCategory + '/edit');
    }
});


module.exports = router;