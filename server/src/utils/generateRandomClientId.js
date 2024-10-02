const generateRandomClientId = (length = 10) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let clientId = '';
    for (let i = 0; i < length; i++) {
        clientId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return clientId;
}

module.exports = generateRandomClientId;