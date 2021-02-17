const { authService } = require('../services/jwt-token-service');

const checkSecurityAns = async (req, res) => {
  let token = await authService.generateJwt({
    oaid: userDetails.OAID,
    sparakid: oalinkmaster.SparakID,
    sungardid: oalinkmaster.SunGardID,
    username: userDetails.username,
    userId: userDetails.id,
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
