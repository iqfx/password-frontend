import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { resolve } from "path";

export default withApiAuthRequired(async function products(req, res) {
  const query = req.query;
  const passwordid = { query };
  const { accessToken } = await getAccessToken(req, res, {
    scopes: ["openid"],
  });
  fetch(
    process.env.PASSWORD_SERVICE_URL +
      "/password/" +
      passwordid.query.passwordid,
    {
      method: req.method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-type": "application/json",
        Accept: "application/json",
      },
      body: req.body ? req.body : undefined,
    }
  )
    .then((response) => {
      res.statusCode = response.status;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "max-age=180000");
      res.end(JSON.stringify(response));
      resolve();
    })
    .catch((error) => {
      res.json(error);
      res.status(405).end();
      resolve();
    });
});
