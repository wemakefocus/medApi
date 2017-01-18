"use strict";
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var request = require("request");
var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};


module.exports.register = function(req, res) {
    // console.log("!!!!!");
    // console.log(req.body);
    if (!req.body.name || !req.body.email || !req.body.password || !req.body.authority) {
        console.log("name", req.body.name);
        console.log("email", req.body.email);
        console.log("password", req.body.password);
        sendJSONresponse(res, 400, { message: "请完成所有字段" });
        return;
    }
    var user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.authority=req.body.authority;
    user.setPassword(req.body.password);
    user.save(function(err) {
        var token;
        if (err) {
            sendJSONresponse(res, 404, err);
        } else {
            token = user.generateJwt();
            sendJSONresponse(res, 200, { 'token': token });
        }

    });
};
module.exports.login = function(req, res) {
     console.log(req);
    if (!req.body.email || !req.body.password) {
        console.log(req);
        sendJSONresponse(res, 400, { message: '请输入邮箱和密码啦啦啦!!!' });
        return;
    }
    passport.authenticate('local', function(err, user, info) {
        var token;
        var authority;
        if (err) {
            sendJSONresponse(err, 404, err);
            return;
        }
        if (user) {
            token = user.generateJwt();
            authority=user.authority;
            sendJSONresponse(res, 200, { "token": token ,"auth":authority});
            console.log("what the hell");
        } else {
            sendJSONresponse(res, 401, info);
        }

    })(req,res);
};

module.exports.transfer = function (req, res) {
    var q;
    console.log(req);
    console.log(req.query);
    q = JSON.parse(req.query.q);
    console.log(q.path);
    console.log(q.params);
    // var token = "getToken()";
    // sendJSONresponse(res, 200, { message: token});
    // res.write("success");
    // res.write(getToken());
    getTokenAndData(res, q.path, JSON.stringify(q.params));
};

function getTokenAndData(originRes, path, params) {
    var form = {
            username: process.env.username,
            password: process.env.password
        };
    request({
        headers: {
            "apikey": process.env.devKey
        },
        uri: "http://59.110.52.133:8000/login/",
        body: JSON.stringify(form),
        method: "POST"
    },
        function (err, res, body) {
            var token;
            if (err) {
                console.log(err);
                return;
            }
            console.log(body);
            body = JSON.parse(body);
            token = body.token;
            console.log(token);
            getResData(token, path, params, originRes);
            return token;
        }
    );
}
function getResData(token, path, params, originRes) {
    var uri = "http://59.110.52.133:8000" + path + "/?q=" + params;
    console.log(uri);
    console.log(token);
    request({
        headers: {
            "apikey": process.env.devKey,
            "token": token
        },
        uri: uri,
        method: "GET"
    },
    function (err, res, body) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(body);
        sendJSONresponse(originRes, 200, JSON.parse(body));
    });
}
