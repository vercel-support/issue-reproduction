const { authService } = require('../services/jwt-token-service');

const checkSecurityAns = async (req, res) => {
  let token = await authService.generateJwt({
    oaid: '123',
    sparakid: '123',
    sungardid: '123',
    username: '123',
    userId: '123',
  });

  const responseObj = {
    status: 200,
    body: JSON.stringify({
      token: token,
      message: 'Answer is valid',
    }),
  };

  return res.status(responseObj.status).send(responseObj.body);
};

export default checkSecurityAns;
