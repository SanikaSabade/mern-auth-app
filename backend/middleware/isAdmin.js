const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized', success: false });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedToken.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin only', success: false });
    }

    req.user = decodedToken;  
    next();
  } catch (err) {
    res.status(500).json({ message: 'Invalid token', success: false });
  }
};

module.exports = isAdmin;
