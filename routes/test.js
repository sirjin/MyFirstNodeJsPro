
var http = require('http');
var querystring = require('querystring');

var post_options = {
    host: 'www.imei.info',
    port: '80',
    path: '/login',
    method: 'post',
    auth: 'login:byor;password:6198vickiFJ',
    'login-form-type':'pwd',
    headers: {
        //'Content-length':post_data.length,
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

var post_options_imei = {
    host: 'www.imei.info',
    port: '80',
    path: '/checkimei',
    method: 'post',
    auth: 'imei=355666050662583',
    'login-form-type':'pwd',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

var post_data = querystring.stringify({
    username:'byor',
    password:'6198vickiFJ',
    'login-form-type':'pwd'
});


// Set up the request
var post_req = http.request(post_options, function(res) {
    res.setEncoding('utf8');
    console.info("响应状态："+res.statusCode);
    if(res.statusCode==302){
        post_req_imei.end();
    }
    console.log(JSON.stringify(res.headers));

    res.on('data', function (chunk) {

        console.log('Response: ' + chunk);
    });
});

var post_req_imei = http.request(post_options_imei, function(res) {
    res.setEncoding('utf8');
    console.info("响应状态："+res.statusCode);

    console.log(JSON.stringify(res.headers));

    /*res.on('data', function (chunk) {

        console.log('Response: ' + chunk);
    });*/
});

JSON.stringify(post_req.headers);
console.log("begin");


// post the data
post_req.write(post_data);
post_req.end();