export default {
  createUser: `
   INSERT INTO
      users(
         first_name, 
         middle_name, 
         last_name, 
         username, 
         email, 
         phone_no,
         date_of_birth, 
         country, 
         city, 
         state, 
         password, 
         salt
         ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, first_name, middle_name, last_name, username, email, 
      phone_no, date_of_birth, country, city, state
   `,
  findUserByEmail: 'SELECT * FROM users WHERE email=$1',
  findUserByUsername: 'SELECT * FROM users WHERE username=$1',
  findUserByPhone: 'SELECT * FROM users WHERE phone_no=$1',
  findUserByEmailOrUsername: 'SELECT * FROM users WHERE email=$1 OR username=$1'
};
