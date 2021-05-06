const express = require("express");
const fetch = require("node-fetch");

let code, token;

function postMessage(message, res) {
  const formData = new URLSearchParams({ message });
  return fetch("https://notify-api.line.me/api/notify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((resp) => resp.json())
    .then((result) => {
      return res.status(result.status).json(result);
    });
}

function fetchToken(code) {
  const formData = new URLSearchParams();
  formData.append("grant_type", "authorization_code");
  formData.append("code", code);
  formData.append("redirect_uri", "http://localhost:3000/callback");
  formData.append("client_id", "YOUR_CLIENT_ID");
  formData.append(
    "client_secret",
    "YOUR_CLIENT_SECRET"
  );

  return fetch("https://notify-bot.line.me/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });
}

const messageRouter = express
  .Router()
  .use(express.json())
  .post("/notify", function (req, res) {
    const { code: reqCode, message } = req.body;

    if (reqCode !== code) {
      code = reqCode;
      return fetchToken(code)
        .then((resp) => resp.json())
        .then((result) => {
          const { status, access_token } = result;
          token = access_token;
          if (status !== 200) {
            return res.status(status).json(result);
          }
          return postMessage(message, res);
        });
    } else if (token) {
      return postMessage(message, res);
    }
    return res.status(400).json({ status: 400, message: "Invalid request" });
  });

module.exports = messageRouter;
