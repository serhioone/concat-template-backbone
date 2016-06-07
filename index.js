'use strict';

var through = require('through2'),
    gutil = require('gulp-util'),
    File = gutil.File,
    path = require("path");


module.exports = function(fileName, options) {

    options = options || {
        prefix: "Vtb.template",
        dirName: false
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

        var methodName = path.basename(file.path).split('.');
        if(options.dirName) {
            var dirName = file.base.split("templates/")[1].split("/");
            var dj = dirName.length - 2;
        }
        if(options.dirName) {
            text += "\n\t" + options.prefix + "." + dirName[dj] + "." + methodName[0] + " = '";
        } else {
            text += "\n\t" + options.prefix + "." + methodName[0] + " = '";
        }
        
        text += "<script>" + file.contents.toString().replace(/(\r\n|\n|\r|\t)/gm,"").replace(/\s{2,}/g, ' ') + "</script>";
        text += "';";

        // minify(file.path, function(error, data) {
        //     if (error) {
        //         console.error(error.message);
        //     } else {
        //         console.log(data);
        //         text += data;
        //         // console.log(text);
        //         // console.log("------");
        //     }
        // });

        // console.log(compileText);

        

        callback();
    };

    function endStream(callback) {
        
        // console.log(text += footer);

        // exportFile.relative = "test.js";
        // exportFile.contents = text + footer;

        // console.log(exportFile);
        // this.push(text + footer);

        //Configure outgoing file.
        var joinedPath = path.join(firstFile.base, fileName);

        var joinedFile = new File({
            cwd: firstFile.cwd
            ,base: firstFile.base
            ,path: joinedPath
            ,contents: new Buffer(text + footer)
        });

        // console.log(joinedFile);
        this.push(joinedFile);
        callback();
    }

    return through.obj(bufferContents, endStream);
};