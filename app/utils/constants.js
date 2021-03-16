import config from '../../config/env';

const { CRYPTO_BASE_URL, NODE_ENV, PORT } = config;

const BASE_URL = NODE_ENV === 'production'
  ? CRYPTO_BASE_URL
  : `http://localhost:${PORT || 3000}`;

export default {
  INTERNAL_SERVER_ERROR: 'Oops, something broke on the server!!!',
  NOT_FOUND_API: 'Oops, You have reached a dead end',
  INVALID_PERMISSION:
    'Permission denied. Current user does not have the required permission to access this resource.',
  INVALID_CREDENTIALS: 'Incorrect login details',
  ACCESS_REVOKED: 'Your access has been revoked',
  EMAIL_CONFLICT: 'A user with your email already exists',
  AUTH_REQUIRED: 'Access denied,a valid access token is required',
  '2HRS': 7200,
  '8HRS': 28800,
  BASE_URL,
  jobTypes: {

  },
  events: {

  },
  INVALID_ROLE_PARAMETER: 'Invalid role value',
  INVALID_TYPE_PARAMETER: 'Invalid facility type value',
  ACCESS_FIELD_REQUIRED: 'access field is required as boolean',
  ADMIN_TO_ADMIN_NOT_ALLOWED:
    'You cannot remove an admin within your rank unless you are the owner of the app',
  DB_ERROR_STATUS: 'DB_PROCESS_FAILED',
  MODULE_ERROR_STATUS: 'MODULE_PROCESS_BROKE',
  SUCCESS: 'success',
  SUCCESS_RESPONSE: 'Request was successfully processed',
  FAIL: 'fail',
  WELCOME: 'Thanks for dropping by,you are crypto backend',
  v1: '/api/v1',
  DB_ERROR: 'A database error occurred, either in redis or postgres',
  MODULE_ERROR: 'A module error occurred',
  FACILITY_ACCESS_DENIED:
    'You are not allowed to access resources for other Facilities',
  USER_EMAIL_EXIST_VERIFICATION_FAIL: 'USER_EMAIL_EXIST_VERIFICATION_FAIL',
  USER_EMAIL_EXIST_VERIFICATION_FAIL_MSG:
    'Error verifying existence of email, try again.',
  USER_NOT_FOUND_MSG: 'A USER with the id provided was not found',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  CREATE_USER_SUCCESSFULLY: 'Successfully registered USER to FACILITY.',
  CREATE_USER_FAILED: 'Error registering USER',
  LOGIN_USER_SUCCESSFULLY: 'Successfully logged in user',
  FETCH_USERS_SUCCESSFULLY: 'Successfully retrieved users',
  FETCH_USER_SUCCESSFULLY: 'Successfully retrieved USER',
  UPDATE_USER_SUCCESSFULLY: 'Successfully updated USER',
  VALIDATE_USER_ID_FAIL: 'Error validating USER id',
  ERROR_FETCHING_USERS: 'Error fetching users',
  ERROR_UPDATING_USER: 'Error updating USER',
  FAILED_TO_START_END_OF_DAY: 'Error ending day',
  SUCCESSFULLY_STARTED_END_OF_DAY:
    'End of day has been initialized successfully',
  SUCCESSFULLY_GRANT_ACCESS: 'Successfully granted USER access',
  SUCCESSFULLY_REVOKED_ACCESS: 'Successfully revoked USER access',
  FETCH_FACILITIES_SUCCESSFULLY: 'Successfully retrieved Facilities',
  FETCH_FACILITY_SUCCESSFULLY: 'Successfully retrieved FACILITY',
  UPDATE_USER_PASSWORD_SUCCESSFULLY: 'Successfully changed password',
  ERROR_UPDATING_PASSWORD: 'Error changing password',
  UPDATED_USER_ACCESS_FAILED_MSG: 'Error updating USER access',
  SUCCESSFULLY_UPDATED_FACILITY: 'Successfully updated USER FACILITY',
  USER_FACILITY_UPDATE_FAILED: 'Error updating USER FACILITY',
  SUCCESSFULLY_UPDATED_ROLE: 'Successfully updated USER role',
  USER_ROLE_UPDATE_FAILED: 'Error updating USER role',
  SUCCESSFULLY_REMOVED_USER: 'Successfully removed USER from FACILITY',
  ERROR_REMOVING_USER: 'Error removing USER from FACILITY',
  ROLE_NOT_SUFFICIENT_FACILITY:
    'You do not have sufficient permission to interact with this FACILITY resource',
  REDIS_RUNNING: 'Redis server is running',
  CRYPTO_WALLET_RUNNING: 'CRYPTO wallet is running on PORT',
  USERNAME_ERROR: 'Username registered already',
  PHONE_ERROR: 'Phone registered already',
  GENERIC_ERROR: 'Sorry, something went wrong',
  RESOURCE_NOT_EXISTS_IN_DB: 'User does not exists',
  FETCH_CATEGORY_SUCCESSFUL: 'Fetched all categories sucessfully',
  SAVE_TOKEN_FAIL: 'SAVE_VERIFICATION_TOKEN_FAIL',
  TOKEN_NOT_EXIST: 'Token does not exist or expired',
  CREATE_WALLET_SUCCESSFULLY: 'Wallet created successfully'
};
