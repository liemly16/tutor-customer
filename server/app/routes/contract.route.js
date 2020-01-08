const express = require('express');
const app = express();
const contractController = require('../controllers/contract.controller');
const passport = require('passport');
const userUtils = require('../utils/user.utils');
const EUserType = require('../enums/EUserTypes');

app.get('/contract', contractController.getContractList);
app.get('/contract/quantity', contractController.countContracts);
app.get(
  '/contract/:id',
  passport.authenticate('jwt', { session: false }),
  contractController.getContract
);

app.post('/contract/create', contractController.createContract);
app.post(
  '/contract/report',
  passport.authenticate('jwt', { session: false }),
  userUtils.checkRole(EUserType.STUDENT),
  contractController.sendReport
);

module.exports = app;
