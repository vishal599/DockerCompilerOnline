module.exports = function(io){
  var express = require('express');
  var dockerController = require('../controllers/docker.controller')(io);
  var SocketService = require('../services/socket.service');
  var router = express.Router();

  router.post('/test', function(req, res, next){
    io.sockets.emit('foo', 'oh yeah');
    console.log(req.body);
    res.json({
      msg:'success'
    })
  });

  router.post('/file', dockerController.fileSave, dockerController.compile);
  router.post('/online', dockerController.directSave, dockerController.compile);
  router.post('/download', dockerController.download);

  // module.exports = router;
  return router;
}
