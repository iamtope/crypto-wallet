/* Replace with your SQL commands */
ALTER TABLE users 
DROP COLUMN eth_address_salt,
DROP COLUMN country,
DROP COLUMN city,
DROP COLUMN state,
ADD COLUMN address VARCHAR;

INSERT INTO api_key (api_key) VALUES ('29a509c2f60a78402aa1581cef8b99942ca81b92');
