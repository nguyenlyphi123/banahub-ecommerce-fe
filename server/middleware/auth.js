const jwt = require('jsonwebtoken');
const { EMPLOYEE, ADMIN } = require('../constants/constants');

const verifyToken = {
  verifyAdmin: (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token)
      return res
        .status(401)
        .json({ success: false, message: 'Access token not found' });

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.id = decoded.id;

      if (decoded.level === ADMIN) next();
      else
        return res
          .status(400)
          .json({ success: false, message: 'Invalid token' });
    } catch (error) {
      console.log(error);
      res.status(403).json({ success: false, message: 'Invalid token' });
    }
  },

  verifyUser: (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token)
      return res
        .status(401)
        .json({ success: false, message: 'Access token not found' });

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      req.id = decoded.id;
      next();
    } catch (error) {
      console.log(error);
      res.status(403).json({ success: false, message: 'Invalid token' });
    }
  },

  verifyEmployee: (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token)
      return res
        .status(401)
        .json({ success: false, message: 'Access token not found' });

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      req.id = decoded.id;
      req.position = decoded.position;

      if (decoded.level === EMPLOYEE || decoded.level === ADMIN) next();
      else
        return res
          .status(400)
          .json({ success: false, message: 'Invalid token' });
    } catch (error) {
      console.log(error);
      res.status(403).json({ success: false, message: 'Invalid token' });
    }
  },
};

module.exports = verifyToken;
