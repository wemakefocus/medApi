"use strict";
var mongoose = require('mongoose');

var dbURI = 'mongodb://localhost/MedAngular';
//var dbURI = 'mongodb://reader:loveReading@ds021343.mlab.com:21343/readingdb';
mongoose.connect(dbURI);

//var dbURIlog = 'mongodb://localhost/RClublog';
//var logDB = mongoose.createConnection(dbURIlog);
//logDB.on('connected', function () {
//    console.log('Mongoose connected to ' + dbURIlog);
//});
//logDB.close(function () {
//    console.log('Mongoose log disconnected');
//});
// �����¼�
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

// ��Ӧ����������ֹ��ʱ�� �ر�����
var gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

// nodemon ���� ò��û��
process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});

// Ӧ����ֹ
process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
        process.exit(0);
    });
});

// For Heroku app termination
process.on('SIGTERM', function () {
    gracefulShutdown('Heroku app shutdown', function () {
        process.exit(0);
    });
});

require('./books.js');