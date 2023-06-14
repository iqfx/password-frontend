import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function products(req, res) {
  // If your Access Token is expired and you have a Refresh Token
  // `getAccessToken` will fetch you a new one using the `refresh_token` grant
  const { accessToken } = await getAccessToken(req, res, {
    scopes: ["openid"],
  });
  fetch(process.env.USERMANAGEMENT_SERVICE_URL + "/user", {
    method: req.method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      res.json(data);
      res.status(data.status).end();
    })
    .catch((error) => res.status(500).json({ error }));
});
