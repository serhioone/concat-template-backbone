'use strict';

var through = require('through2'),
    gutil = require('gulp-util'),
    File = gutil.File,
    path = require("path");


module.exports = function(fileName, options) {

    options = options || {
        prefix: "Vtb.template"
    };

    var firstFile = null;
    var contentFile;
    var header = "var Vtb = Vtb  || {};\n(function () {\n'use strict';"
    var footer = "\n})();"
    var text = header;

    function bufferContents(file, enc, callback) {
        // ignore empty files
        if (file.isNull()) {
          callback();
          return;
        }

        if (!firstFile) {
            firstFile = file;
        }

        var methodName = file.relative.split('.');

        text += "\n\t" + options.prefix + "." + methodName[0] + " = '"
        text += "<script>" + file.contents.toString().replace(/(\r\n|\n|\r|\t)/gm,"").replace(/\s{2,}/g, ' ') + "</script>";
        text += "';";

        callback();
    };

    function endStream(callback) {
        
        var joinedPath = path.join(firstFile.base, fileName);

        var joinedFile = new File({
            cwd: firstFile.cwd
            ,base: firstFile.base
            ,path: joinedPath
            ,contents: new Buffer(text + footer)
        });

        this.push(joinedFile);
        callback();
    }

    return through.obj(bufferContents, endStream);
};