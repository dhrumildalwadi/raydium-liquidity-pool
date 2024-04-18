require('dotenv').config();

const fs = require('fs');
const base58 = require('bs58');

const pkey = process.env.PRIVATE_KEY;
const privateKey = base58.decode(pkey);

// Define the file path for the JSON file
const filePath = './secretKey.json';

// Write the JSON data to the file
fs.writeFileSync(filePath, JSON.stringify(Array.from(privateKey)));

console.log(`Keypair successfully exported to ${filePath}`);
