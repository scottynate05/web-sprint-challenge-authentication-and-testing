if (!process.env.JWT_SECRET) {
    console.log('you must create a jwt_secret');
};

module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'do not add a default in production!'
};