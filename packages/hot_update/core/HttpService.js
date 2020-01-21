"use strict";
var http = require("http"), https = require("https"), qs = require("querystring"), HttpService = function () {
}, pro = HttpService.prototype;
pro.sendHttpGetReq = function (t, n, e, r, o) {
    var i = qs.stringify(r), s = {hostname: t, port: n, path: e + "?" + i, method: "GET"},
        u = http.request(s, function (t) {
            t.setEncoding("utf8"), t.on("data", function (t) {
                o(null, JSON.parse(t))
            })
        });
    u.on("error", function (t) {
        o(new Error("err"), null)
    }), u.end()
}, pro.sendHttpsGetReq = function (t, n, e, r, o) {
    var i = qs.stringify(r);
    https.get(t + ":" + n + e + "?" + i, function (t) {
        t.on("data", function (t) {
            o(null, JSON.parse(t.toString()))
        })
    }).on("error", function (t) {
        o(t)
    })
}, pro.sendHttpPostReq = function (t, n, e, r, o) {
    var i = qs.stringify(r), s = {
        hostname: t,
        port: n,
        path: e,
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded", "Content-Length": i.length}
    }, u = http.request(s, function (t) {
        if (200 == t.statusCode) {
            t.setEncoding("utf8");
            var n = "";
            t.on("data", function (t) {
                n += t
            }), t.on("end", function () {
                o(null, JSON.parse(n))
            })
        } else t.send(500, "error"), o(new Error("err"), null)
    });
    u.on("error", function (t) {
        o(new Error("err"), null)
    }), u.write(i), u.end()
}, pro.sendHttpsPostReq = function (t, n, e, r, o) {
    e = e + "?" + qs.stringify(r);
    var i = {hostname: t, port: n || 443, path: e || "/", method: "POST"};
    https.request(i, function (t) {
        t.on("data", function (t) {
            o(null, JSON.parse(t.toString()))
        })
    }).on("error", function (t) {
        o(t)
    })
}, module.exports = new HttpService;