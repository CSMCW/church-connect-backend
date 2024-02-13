const { Router } = require('express');
const authHelpers = require('../utils/auth');
const districtControllers = require('../controllers/districtController');

const districtRoute = Router();

//handling getting all districts
districtRoute.get('/', districtControllers.getDistricts);

//handling getting a specific district
districtRoute.get('/:districtId', districtControllers.getDistrictById);

//handling adding a new district
districtRoute.post(
  '/newDistrict',
  authHelpers.authenticateToken,
  districtControllers.addDistrict,
);

//handling editing a district
districtRoute.put(
  '/:districtId',
  authHelpers.authenticateToken,
  districtControllers.editDistrictById,
);

//handling deleting a district
districtRoute.delete(
  '/:districtId',
  authHelpers.authenticateToken,
  districtControllers.deleteDistrictById,
);

module.exports = districtRoute;
