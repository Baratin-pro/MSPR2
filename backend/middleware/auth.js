'use strict';

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'IdUsers non valide !';
    } else {
      req.user = decodedToken;
      next();
    }
  } catch {
    res.status(401).send({
      error: 'Requête auth invalide !',
    });
  }
};
