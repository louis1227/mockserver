'use strict';
var assert = require('assert');
var path = require('path');
var fs = require('fs');
var http = require('http');
var thinkjs = require('thinkjs');
var ROOT_PATH = path.dirname(__dirname);
thinkjs.load({
    ROOT_PATH: ROOT_PATH,
    APP_PATH: ROOT_PATH + think.sep + 'app',
    RUNTIME_PATH: ROOT_PATH + think.sep + 'runtime',
    RESOURCE_PATH: ROOT_PATH + think.sep + 'www'
});
//get http object
var getHttp = function(options) {
    var req = new http.IncomingMessage();
    req.headers = {
        'host': 'http://127.0.0.1:8033',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit',
    };
    req.method = 'GET';
    req.httpVersion = '1.1';
    req.url = '/project/add';
    var res = new http.ServerResponse(req);
    res.write = function() {
        return true;
    }
    return think.http(req, res).then(function(http) {
        if (options) {
            for (var key in options) {
                http[key] = options[key];
            }
        }
        return http;
    })
}
describe('unit test', function() {
    it('test controller', function(done) {
        getHttp({
            module: 'home',
            controller: 'project',
            action: 'add'
        }).then(function(http) {
            // beforeEach(function() {
            //     console.log('beforeEach');
            // });
            var instance = think.controller('project', http, 'home');
            // console.log(instance.indexAction())
            instance.__before().then(() => {
                return instance.addAction().then((data) => {
                    console.log(data)
                    done()
                }).catch(error => {
                    if (think.isPrevent(error)) {
                        done()
                        return;
                    }
                })
            }).catch(error => {
                if (think.isPrevent(error)) {
                    done()
                    return;
                }
            })
            /**
             * instance.xxx().then(function(){
       *   //done();
       * })
             */
            // done();
        })
    })
    it('test model', function(done) {
        var dbConfig = think.config('db');
        //get model instance
        var instance = think.model('user', dbConfig, 'home');
        /**
         * instance.xxx().then(function(data){
     *   assert.deepEqual(data, {});
     *   //done();
     * })
         */
        done();
    })
});