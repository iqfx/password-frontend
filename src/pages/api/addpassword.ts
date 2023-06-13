import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function products(req, res) {
  const { accessToken } = await getAccessToken(req, res, {
    scopes: ["openid"],
  });
  // return res.status(200).json(req.body);
  fetch(process.env.PASSWORD_SERVICE_URL + "/password", {
    method: "post",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
      Accept: "application/json",
    },
    body: req.body,
  }).then((response) => {
    return res.json(response.json);
  });
});
