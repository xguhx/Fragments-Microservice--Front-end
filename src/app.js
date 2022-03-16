// src/app.js

import { Auth, getUser } from "./auth";
import { getUserFragments } from "./api";
const apiUrl = process.env.API_URL;

async function init() {
  // Get our UI elements
  const userSection = document.querySelector("#user");
  const loginBtn = document.querySelector("#login");
  const metadataBtn = document.querySelector("#metadata");
  const logoutBtn = document.querySelector("#logout");
  const postBtn = document.querySelector("#post");
  const post2Btn = document.querySelector("#postJson");

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();

  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    // Do an authenticated request to the fragments API server and log the result

    return;
  }

  metadataBtn.onclick = async () => {
    try {
      const res = await fetch(`${apiUrl}/v1/fragments?expand=1`, {
        headers: {
          // Include the user's ID Token in the request so we're authorized
          Authorization: `Bearer ${user.idToken}`,
        },
      });
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      console.log("Got user fragments metadata", { data });
    } catch (err) {
      console.error("Unable to call GET /v1/fragments?expand=1", { err });
    }
  };

  //debugger;
  postBtn.onclick = async () => {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: "POST",
      body: document.querySelector("#fragment").value,
      headers: {
        // Include the user's ID Token in the request so we're authorized
        Authorization: `Bearer ${user.idToken}`,
        "Content-Type": "text/*",
      },
    });
  };

  post2Btn.onclick = async () => {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: "POST",
      body: document.querySelector("#fragmentJson").value,
      headers: {
        // Include the user's ID Token in the request so we're authorized
        Authorization: `Bearer ${user.idToken}`,
        "Content-Type": "application/json",
      },
    });
  };

  // Log the user info for debugging purposes
  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector(".username").innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;

  getUserFragments(user);
}

// Wait for the DOM to be ready, then start the app
addEventListener("DOMContentLoaded", init);
