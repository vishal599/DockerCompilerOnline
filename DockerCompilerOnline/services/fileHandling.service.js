var fs = require("fs");
var { Readable } = require('stream');
const Config = require('../config');

const FILE_PATH = Config.bindPath;

const multer = require('multer');
const storage = multer.diskStorage({
  destination: FILE_PATH,
  filename: function(req, file, cb){
    cb(null, file.originalname);
  }
})
exports.upload = multer({
  storage: storage
}).array('file-to-upload', 3);

exports.writeToFile = function(data, filename){
  var input = new Readable();
  input.push(data);
  input.push(null);
  var file = createFile(filename);
  input.pipe(file);
}

exports.createFile = function(filename){
  return createFile(filename);
}

exports.deleteFile = function(filename){
  fs.unlinkSync(`${FILE_PATH}/${filename}`);
}

exports.deleteFiles = function(files){
  files.forEach(function(filename){
    fs.unlinkSync(`${FILE_PATH}/${filename}`);
  });
}



function createFile(filename){
  var file = fs.createWriteStream(`${FILE_PATH}/${filename}`);
  return file;
};
