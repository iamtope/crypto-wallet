/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS wallet_key(
    id SERIAL PRIMARY KEY,
    wallet_id SERIAL REFERENCES wallet(id) ON DELETE CASCADE ON UPDATE CASCADE,
    private_key VARCHAR(100) NOT NULL,
    public_key VARCHAR(100),
    passphrase VARCHAR(200) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE transactions
    ADD transaction_id VARCHAR; 