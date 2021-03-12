/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE coin_type AS ENUM (
  'eth',
  'btc'
);

CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_no VARCHAR(30) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    password VARCHAR NOT NULL,
    salt VARCHAR NOT NULL,
    transaction_pin VARCHAR,
    transaction_salt VARCHAR,
    eth_address_password VARCHAR,
    eth_address_salt VARCHAR,
    forgot_password_otp VARCHAR(10),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallet(
    id SERIAL PRIMARY KEY,
    user_id SERIAL REFERENCES users(id),
    coin coin_type NOT NULL,
    address VARCHAR(100),
    balance VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions(
    id UUID PRIMARY KEY DEFAULT (uuid_generate_v1()),
    sender_wallet_address VARCHAR NOT NULL,
    receiver_wallet_address VARCHAR NOT NULL,
    amount FLOAT NOT NULL,
    gas INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS api_key(
  id SERIAL PRIMARY KEY,
  api_key VARCHAR(100) NOT NULL,
  no_of_calls INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
   )


