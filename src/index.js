const createUserController = require('./controller/createUser');
const changeTeamController = require('./controller/changeteam');
const express = require('express');
const router = express.Router();

function setupRoutes(prisma,model) {
  router.post('/adduser/:user_Id/:prev_Id', async (req, res) => {
    try{
      const result = await createUserController.createUser(prisma, model, req.params);
      res.status(200).json(result);
    }catch(err){
      res.status(500).json({error: err.message });
    }
  }); 
  router.post('/changeteam/:user_Id/:new_prev_Id', async (req, res) => {
    try{
      const result = await changeTeamController.changeTeam(prisma,model, req.params);
      res.json(result);
    }catch(err){
      res.status(500).json({error: err.message });
    }
  } );
  router.get('/getall', async (req, res) => {
    try{
      const records = await require('./controller/getall').getall(prisma, model);
      return router;
    }catch(err){
      res.status(500).json({error: err.message });
    }
  })
}

module.exports = { setupRoutes };