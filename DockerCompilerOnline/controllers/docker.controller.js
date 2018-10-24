module.exports = function(io){
  var Docker = require('dockerode');
  var docker = new Docker({socketPath: '/var/run/docker.sock'});
  var FileService = require('../services/fileHandling.service');
  var DockerService = require('../services/docker.service');
  var path = require('path');
  var Config = require('../config');

  return  {
    fileSave : function(req, res, next){
      debugger;
      FileService.upload(req, res, (err)=>{
        if(err){
          res.json({
            msg : err
          });
        }
        else{
          let data = [];
          FileService.writeToFile(req.body.args, 'args.txt'); // TODO: This is dummie args file, generatene for each
          req.files.forEach(function(item) {
            let info = {
              filename : item.filename,
              language: req.body.language,
              args : 'args.txt'
            }
            data.push(info);
          });
          req.specialData = data;
          next();
        }
      })
    },

    directSave : function(req, res, next){
      // let filename =
      FileService.writeToFile(req.body.code, `input.${req.body.exts}`);
      FileService.writeToFile(req.body.args, 'args.txt');

      let info = {
        filename : `input.${req.body.exts}`,
        language: req.body.language,
        args : 'args.txt'
      }
      let data = [];
      data.push(info);
      req.specialData = data;
      next();
    },

    compile : function(req,res, next) {
      let files = req.specialData;
      // let numberOfFiles = files.length;
      let flag = true;
      files.forEach(function(data){
        let dockerArgs = DockerService.args(data);
        const image = dockerArgs[data.language]['image'];
        const command = dockerArgs[data.language]['CMD'];
        const options = dockerArgs['options'];
        let outputFile = FileService.createFile(`${data.filename}-out.txt`);

        console.log(options);

        docker.run(image, command, outputFile, options)
        .then(function(container) {
          if(flag == true){
            res.sendFile(path.join(Config.filePath, `${data.filename}-out.txt`));
            flag = false;
          }

          io.to(req.body.socket).emit('foo', `${data.filename}-out.txt`);
          // FileService.deleteFiles([`${data.filename}`, `${data.filename}-out.txt`]);
          return container.remove();
        })
        .catch(function(err) {
          console.log(err);
        });
      });
    },

    download : function(req, res, next){
      let id = req.body.id;
      console.log(id);
      res.download(path.join(Config.filePath, `${id}`));
    }
  }
}
