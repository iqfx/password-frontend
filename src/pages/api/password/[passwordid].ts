import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function products(req, res) {
  const query = req.query;
  const passwordid = { query };
  const { accessToken } = await getAccessToken(req, res, {
    scopes: ["vault:default"],
  });
  // return res.status(200).json(passwordid.query.passwordid);
  fetch(
    process.env.PASSWORD_SERVICE_URL +
      "/password/" +
      passwordid.query.passwordid,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then((response) => {
    return res.json(response.json);
  });
});
