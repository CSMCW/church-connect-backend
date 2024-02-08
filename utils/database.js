require('dotenv').config();

const supabaseClient = require('../config/supabaseConfig');
const logWriter = require('./logger');

//get all documents from datase
const getAllFromDatabase = async (tablename) => {
  const { data: existingRecord, error: Error } = await supabaseClient
    .from(tablename)
    .select();

  //if there is an error, throw error else return result
  if (Error) {
    logWriter('Error getting all from database', 'errorsLogs.log');
    throw Error;
  } else {
    return existingRecord;
  }
};

//query database with query options
const queryDatabase = async (queryOptions) => {
  const { data: existingRecord, error: Error } = await supabaseClient
    .from(queryOptions.tableName)
    .select()
    .eq(queryOptions.column, queryOptions.columnValue);

  //if there is an error, throw error else return result
  if (Error) {
    logWriter('Error from database query', 'errorsLogs.log');
    throw Error;
  } else {
    return existingRecord;
  }
};

//insert data into database with insert options
const insertIntoDatabase = async (insertOptions) => {
  const { error: Error } = await supabaseClient
    .from(insertOptions.tableName)
    .insert(insertOptions.data);

  //if error throw error else return true
  if (Error) {
    logWriter('Error inserting into database.', 'errorsLogs.log');
    throw Error;
  } else {
    return true;
  }
};

//update databse with update options
const updateDatabase = async (updateOptions) => {
  const { error: Error } = await supabaseClient
    .from(updateOptions.tableName)
    .update(updateOptions.data)
    .eq(updateOptions.column, updateOptions.columnValue);

  // if error throw erro else return true.
  if (Error) {
    logWriter('Error updating database.', 'errorsLogs.log');
    throw Error;
  } else {
    return true;
  }
};

//delete row from database with options
const deleteRowFromDatabase = async (deleteOptions) => {
  const { error: Error } = await supabaseClient
    .from(deleteOptions.tableName)
    .delete()
    .eq(deleteOptions.column, deleteOptions.columnValue);

  if (Error) {
    logWriter('Error deleting row from database.', 'errorsLogs.log');
    throw Error;
  } else {
    return true;
  }
};

//updating an entire row on database
const updateRowOnDatabase = async (updateOptions) => {
  console.log(updateOptions.data);
  const { error: Error } = await supabaseClient
    .from(updateOptions.tableName)
    .update(updateOptions.data)
    .match(updateOptions.match);

  if (Error) {
    logWriter('Error updating row on database.', 'errorsLogs.log');
    throw Error;
  } else {
    return true;
  }
};

const dbHelpers = {
  getAllFromDatabase,
  queryDatabase,
  insertIntoDatabase,
  updateDatabase,
  deleteRowFromDatabase,
  updateRowOnDatabase,
};

module.exports = dbHelpers;
