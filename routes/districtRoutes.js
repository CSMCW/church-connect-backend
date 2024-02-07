const { Router } = require('express');
const authHelpers = require('../utils/auth');
const districtControllers = require('../controllers/districtController');

const districtRoute = Router();

//handling getting all districts
districtRoute.get('/', districtControllers.getDistricts);

//handling adding a new district
districtRoute.post(
  '/newDistrict',
  authHelpers.authenticateToken,
  districtControllers.addDistrict,
);

//handling editing a district
districtRoute.put(
  '/:districtName',
  authHelpers.authenticateToken,
  districtControllers.editDistrict,
);

//handling deleting a district
districtRoute.delete(
  '/:districtName',
  authHelpers.authenticateToken,
  districtControllers.deleteDistrict,
);

module.exports = districtRoute;
