const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhhhh';                   //secret merely enables the server to verify whether it recognizes this token
const expiration = '2h';

module.exports = {
  authMiddleware: function({ req }) {
    // token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;
  
    // separate "Bearer" from "<tokenvalue>"
    if (req.headers.authorization) {
      token = token
        .split(' ')
        .pop()
        .trim();
    }
  
    // if no token, return request object as is
    if (!token) {
      return req;
    }
  
    try {
      // decode and attach user data to request object
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }
  
    // return updated request object
    return req;
  },

  signToken: function({ username, email, _id }) {                   //function adds username, eamil, and id to the token
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  }
};