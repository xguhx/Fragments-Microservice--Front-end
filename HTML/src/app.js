// src/app.js

import { Auth, getUser } from "./auth";
import {
  getUserFragments,
  convertFragments,
  getMetadata,
  postFragment,
  handleFileUpload,
  displayFragments,
} from "./api";
const apiUrl = process.env.API_URL;

async function init() {
  // Get our UI elements
  const userSection = document.querySelector("#user");
  const loginBtn = document.querySelector("#login");
  const metadataBtn = document.querySelector("#metadata");
  const convertBtn = document.querySelector("#get");
  const logoutBtn = document.querySelector("#logout");
  const postBtn = document.querySelector("#post");
  const listBtn = document.querySelector("#getFragments");

  //const fragmentIdInput = document.querySelector("#fragmentId");
  var select = document.getElementById("content-type");
  var selectMethod = document.getElementById("Method");
  var selectFormat = document.getElementById("Format");

  fragmentId;

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

  //======================================
  //CONVERT A FRAGMENT

  convertBtn.onclick = async () => {
    await convertFragments(document, user, selectFormat);
  };

  //========================================
  //Get Metadata and console.log it
  metadataBtn.onclick = async () => {
    await getMetadata(user);
  };

  //=================================================
  // Post

  postBtn.onclick = async () => {
    await postFragment(user, document, selectMethod, select);
  };

  //==================================================
  //Uplaod a file
  //https://patrickbrosset.com/articles/2021-10-22-handling-files-on-the-web/

  const handleFile = async (event) => {
    await handleFileUpload(event, user);
  };

  document.querySelector("#input-file").addEventListener("change", handleFile);

  //================================================
  //Get Fragments and Display

  listBtn.onclick = async () => {
    await displayFragments(user, document);
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
