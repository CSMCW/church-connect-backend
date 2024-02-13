const createError = require('http-errors');
const { v4: uuidv4 } = require('uuid');

const districtValidator = require('../schemas/districtSchema');
const helpers = require('../utils/helpers');
const dbHelpers = require('../utils/database');
const logWriter = require('../utils/logger');

const tableName = 'districts';

//getting all districts controller
const getDistricts = async (req, res, next) => {
  try {
    // querying database for all districts
    const existingData = await dbHelpers.getAllFromDatabase(tableName);

    //return the data to the client
    const messageOptions = {
      statusCode: 200,
      msgContent: 'Request successful',
      data: existingData,
    };
    helpers.sendMessage(res, messageOptions);
  } catch (error) {
    logWriter('Error from getDistricts controller.', 'errorsLogs.log');
    next(error);
  }
};

//controller for getting specific district
const getDistrictById = async (req, res, next) => {
  try {
    const districtId = req.params.districtId;
    const queryOptions = {
      tableName,
      column: 'districtId',
      columnValue: districtId,
    };
    // querying database for all districts
    const existingData = await dbHelpers.queryDatabase(queryOptions);

    //if district does not exists, throw error
    if (existingData.length == 0) {
      throw new createError.BadRequest('District does not exists.');
    }

    //return the data to the client
    const messageOptions = {
      statusCode: 200,
      msgContent: 'Request successful',
      data: existingData[0],
    };
    helpers.sendMessage(res, messageOptions);
  } catch (error) {
    logWriter('Error from getDistricts controller.', 'errorsLogs.log');
    next(error);
  }
};

//adding a new district
const addDistrict = async (req, res, next) => {
  try {
    const { value: validatedResult, error: validationError } =
      districtValidator.createDistrictSchema.validate(req.body);

    if (validationError) {
      throw new createError.UnprocessableEntity(
        `Cannot process your data, ${validationError.details[0].message}`,
      );
    }
    const queryDbOptions = {
      tableName,
      column: 'districtName',
      columnValue: validatedResult.districtName,
    };
    const existingRecord = await dbHelpers.queryDatabase(queryDbOptions);

    if (existingRecord.length > 0) {
      throw new createError.Conflict('District already exists');
    } else {
      validatedResult.districtId = uuidv4();
      const dbInsertOptions = {
        tableName,
        data: validatedResult,
      };

      const saved = await dbHelpers.insertIntoDatabase(dbInsertOptions);
      if (saved) {
        const messageOptions = {
          statusCode: 201,
          msgContent: 'Saved successfully.',
        };
        return helpers.sendMessage(res, messageOptions);
      }
    }
  } catch (error) {
    logWriter('Error from addDistrict controller.', 'errorsLogs.log');
    next(error);
  }
};

//deleting a district
const deleteDistrictById = async (req, res, next) => {
  try {
    const districtId = req.params.districtId;
    const dbQueryOPtions = {
      tableName,
      column: 'districtId',
      columnValue: districtId,
    };
    const existingData = await dbHelpers.queryDatabase(dbQueryOPtions);
    if (existingData.length > 0) {
      const deleteOptions = {
        tableName,
        column: 'districtId',
        columnValue: districtId,
      };
      const deleted = await dbHelpers.deleteRowFromDatabase(deleteOptions);
      if (deleted) {
        const messageOptions = {
          statusCode: 204,
          msgContent: 'Deleted successfully',
        };
        return helpers.sendMessage(res, messageOptions);
      }
    } else {
      throw new createError.BadRequest('District does not exists');
    }
  } catch (error) {
    logWriter('Error from deleteDistrict controller.', 'errorsLogs.log');
    next(error);
  }
};

//updating a district
const editDistrictById = async (req, res, next) => {
  try {
    const { value: validatedResult, error: validationError } =
      districtValidator.createDistrictSchema.validate(req.body);

    if (validationError) {
      throw new createError.UnprocessableEntity(
        `Cannot process your data, ${validationError.details[0].message}`,
      );
    }

    const districtId = req.params.districtId;
    const dbQueryOPtions = {
      tableName,
      column: 'districtId',
      columnValue: districtId,
    };
    const existingData = await dbHelpers.queryDatabase(dbQueryOPtions);
    if (existingData.length > 0) {
      const updateOptions = {
        tableName,
        data: validatedResult,
        match: { districtId: districtId },
      };

      const updated = await dbHelpers.updateRowOnDatabase(updateOptions);
      if (updated) {
        const messageOptions = {
          statusCode: 201,
          msgContent: 'Updated successfully.',
        };
        return helpers.sendMessage(res, messageOptions);
      }
    } else {
      throw new createError.BadRequest('District does not exists.');
    }
  } catch (error) {
    logWriter('Error from editDistrict controller.', 'errorsLogs.log');
    next(error);
  }
};

const districtControllers = {
  getDistricts,
  getDistrictById,
  addDistrict,
  editDistrictById,
  deleteDistrictById,
};

module.exports = districtControllers;
