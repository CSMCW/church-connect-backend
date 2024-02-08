const Joi = require('joi');

const name = Joi.string()
  .pattern(/^([a-z]|[A-Z]| |,|_|-)+$/)
  .min(3)
  .max(50)
  .lowercase();

const email = Joi.array().items(Joi.string().email().lowercase());

const telephoneNumber = Joi.array().items(Joi.string());

const districtValidator = {
  //creating a new district validator
  createDistrictSchema: Joi.object().keys({
    districtName: name.required(),
    districtChairman: name.required(),
    seniorDistrictSecretary: name.required(),
    districtHeadQuatersAddress: name.required(),
    state: name.required(),
    telephoneNumber: telephoneNumber.required(),
    email,
  }),
};

module.exports = districtValidator;
