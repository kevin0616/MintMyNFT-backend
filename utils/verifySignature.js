const { ethers } = require('ethers');

function verify(message, signature, walletAddress) {
    try {
        const signer = ethers.utils.verifyMessage(message, signature);
        return signer.toLowerCase() === walletAddress.toLowerCase();
    } catch (err) {
        return false;
    }
}

module.exports = verify;
