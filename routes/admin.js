var express = require('express'),
    router  = express.Router();


router.get('/admin', function(req,res) {
    res.render('admin');
});

router.post('/admin/edit', function(req,res) {
    if(req.body.category) {
       res.redirect('/'+ req.body.category +'/edit');
    }
    else if(req.body.category2) {
        res.redirect('/'+ req.body.category2 + '/' + req.body.subCategory2 + '/edit');
    }
    else {
        res.redirect('/'+ req.body.category3 + '/' + req.body.subCategory3 + '/new');
    }
});


module.exports = router;