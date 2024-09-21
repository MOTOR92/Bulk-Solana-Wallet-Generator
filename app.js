"use strict"; 

process.title = "Bulk Solana Wallet Generator by Corvus Codex";

// Importing required modules
const fs = require('fs');
const readline = require('readline');
const { Keypair } = require('@solana/web3.js');

// Creating a readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let wallets = [];

// Function to convert byte array to hex
const convertPrivateKeyToHex = (privateKeyArray) => {
    return Buffer.from(privateKeyArray).toString('hex');
};

// Function to generate CSV content
const convertToCSV = (wallets) => {
    const header = "Public Address,Private Key\n";
    const rows = wallets.map(wallet => `${wallet.public_address},${wallet.private_key}`).join('\n');
    return header + rows;
};

// Prompting the user for the number of wallets to generate
rl.question("How many wallets do you want to generate? ", (numWallets) => {
    console.log(`User entered: ${numWallets}`);

    // Parsing the user input as an integer
    numWallets = parseInt(numWallets);

    // Generating the specified number of wallets
    for (let i = 0; i < numWallets; i++) {
        console.log(`Generating wallet ${i + 1} of ${numWallets}`);

        // Generating a new random Solana keypair
        const keypair = Keypair.generate();
  
        // Getting the private key as a byte array
        const privateKey = keypair.secretKey;
  
        // Getting the public key as a base58 encoded string (i.e. the wallet address)
        const publicKey = keypair.publicKey.toString();
  
        // Convert the private key from byte array to hex format
        const privateKeyHex = convertPrivateKeyToHex(privateKey);

        // Adding the generated wallet to the array
        wallets.push({
            private_key: privateKeyHex,
            public_address: publicKey
        });
    }

    console.log(`Generated ${numWallets} wallets`);

    try {
        // Convert the wallets array to CSV format
        const csvContent = convertToCSV(wallets);

        // Saving the generated wallets to a CSV file using fs.writeFileSync
        fs.writeFileSync('./generated.csv', csvContent);
        console.log(`Saved generated wallets to generated.csv`);
    } catch (err) {
        console.error(`An error occurred while writing to the file: ${err.message}`);
    }

    // Closing the readline interface
    rl.close();
});
