let fs = require("fire-fs"), path = require("fire-path"), self = module.exports = {
    getDirAllFiles(e, t) {
        fs.readdirSync(e).forEach((l, i) => {
            let r = path.join(e, l), n = fs.statSync(r);
            n.isDirectory() ? this.getDirAllFiles(r, t) : n.isFile() && t.push(r)
        })
    },
    getFileString(e, t) {
        let l = 0, i = e.length, r = {};
        for (let n in e) {
            let s = e[n];
            this._isFileExit(s) ? fs.readFile(s, "utf-8", function (e, n) {
                e || self._collectString(n, r), self._onCollectStep(s, ++l, i, r, t)
            }) : self._onCollectStep(s, ++l, i, r, t)
        }
    }, _onCollectStep(e, t, l, i, r) {
        r && r.stepCb && r.stepCb(e, t, l), t >= l && self._onCollectOver(i, r)
    }, _onCollectOver(e, t) {
        let l = [], i = "";
        for (let t in e) i += t, l.push(t);
        t && t.compCb && t.compCb(i)
    },
    mkDir(e) {
        try {
            fs.mkdirSync(e)
        } catch (e) {
            if ("EEXIST" !== e.code) throw e
        }
    },
    isFileExit(e) {
        try {
            fs.accessSync(e, fs.F_OK)
        } catch (e) {
            return !1
        }
        return !0
    }, _collectString(e, t) {
        for (let l in e) {
            let i = e.charAt(l);
            t[i] ? t[i]++ : t[i] = 1
        }
    },
    emptyDir(e) {
        let t = function (e) {
            let l = fs.readdirSync(e);
            for (let i in l) {
                let r = path.join(e, l[i]);
                fs.statSync(r).isDirectory() ? t(r) : fs.unlinkSync(r)
            }
        }, l = function (t) {
            let i = fs.readdirSync(t);
            if (i.length > 0) {
                for (let e in i) {
                    let r = path.join(t, i[e]);
                    l(r)
                }
                t !== e && fs.rmdirSync(t)
            } else t !== e && fs.rmdirSync(t)
        };
        t(e), l(e)
    },
    is_fileType(e, t) {
        t = t.split(",");
        let l = ".(";
        for (let e = 0; e < t.length; e++) 0 !== e && (l += "|"), l += t[e].trim();
        return l += ")$", new RegExp(l, "i").test(e)
    },
    createDirectory(_path) {
        if (fs.existsSync(_path))
            return;

        if (fs.existsSync(self._getParentDirectoryPath(_path))) {
            fs.mkdirSync(_path);
        } else {
            this.createDirectory(self._getParentDirectoryPath(_path));
            fs.mkdirSync(_path);
        }
    }, _getParentDirectoryPath(_path) {
        var tempPath = _path;
        for (var n = tempPath.length - 1; 0 <= n; n--) {
            if (tempPath[n] == '/' || tempPath[n] == '\\')
                if (n != tempPath.length - 1)
                    return tempPath.substr(0, n);
        }
        return "";
    }
};