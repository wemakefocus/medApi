/**
 * Created by think on 2017/1/18.
 */
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

/*var getUser=function(done) {
    User.find(function(err,docs) {
        if (err) {
            return done(err);
        }
        console.log(docs);
        return done(null, docs);
    });
};*/


module.exports.getTheUser=function(req,res){
    User.find().exec(function (err, users) {
        if (err) {
            console.log(err);
            sendJSONresponse(res, 400, err);
            return;
        }
        sendJSONresponse(res, 200,users);
    });
};

module.exports.postTheUser=function(req,res){
    var UserNum;
    for (var i=0;i<req.body.data.length;i++)
    {
        var query={"email":req.body.data[i].Info.email};
        var update={"authority":req.body.data[i].Info.authority};
        //req.newData.authority=req.body.data[0].Info.authority;
        User.findOneAndUpdate(query,update,function(err,doc){
            if (err) throw err;
            //doc.authority=req.body.data[0].Info.authority;
            console.log("success");
        });
    }

    User.count(function(err,count){
        if (err)throw err;
        console.log(count);
        UserNum=count;
        console.log(UserNum);


    });
    /*var query={'email':req.body.data.Info.authority}
    User.find().exec(function(err,users,req))*/
    console.log(req.body.data[0].Info);
    console.log(UserNum);
    /*User.find().exec(function (err, users) {
        if (err) {
            console.log(err);
            sendJSONresponse(res, 400, err);
            return;
        }
        sendJSONresponse(res, 200,users);
    });*/
};