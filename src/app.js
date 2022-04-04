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
  const listBtn = document.querySelector("#getFragments");

  //const fragmentIdInput = document.querySelector("#fragmentId");
  var select = document.getElementById("content-type");
  var selectMethod = document.getElementById("Method");

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

  //==================================
  //Get Metadata and console.log it
  metadataBtn.onclick = async () => {
    try {
      const res = await fetch(`${apiUrl}/v1/fragments/?expand=1`, {
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

  //=================================================
  // Post form

  //debugger;

  postBtn.onclick = async () => {
    if (
      (document.querySelector("#fragment").value.length == 0 &&
        selectMethod.options[selectMethod.selectedIndex].value == "POST") ||
      selectMethod.options[selectMethod.selectedIndex].value == "PUT"
    ) {
      alert("Please Fill All Required Field");
      return;
    }
    const res =
      selectMethod.options[selectMethod.selectedIndex].value == "POST"
        ? await fetch(`${apiUrl}/v1/fragments`, {
            method: selectMethod.options[selectMethod.selectedIndex].value,
            body: document.querySelector("#fragment").value,
            headers: {
              // Include the user's ID Token in the request so we're authorized
              Authorization: `Bearer ${user.idToken}`,
              "Content-Type": select.options[select.selectedIndex].value,
            },
          })
        : await fetch(
            `${apiUrl}/v1/fragments/${
              document.querySelector("#fragmentId").value
            }`,
            {
              method: selectMethod.options[selectMethod.selectedIndex].value,
              body: document.querySelector("#fragment").value,
              headers: {
                // Include the user's ID Token in the request so we're authorized
                Authorization: `Bearer ${user.idToken}`,
                "Content-Type": select.options[select.selectedIndex].value,
              },
            }
          );

    document.querySelector("#fragment").value = "";
  };

  //==================================================
  //Uplaod a file

  //https://patrickbrosset.com/articles/2021-10-22-handling-files-on-the-web/

  const handleFile = async (event) => {
    const input = event.target;
    const files = input.files;

    console.log("event.target", event.target);
    console.log("input.files", input.files);
    if (!files.length) {
      return;
    }

    for (const file of files) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        let result = e.target.result;

        const res = await fetch(`${apiUrl}/v1/fragments`, {
          method: "POST",
          body: result,
          headers: {
            // Include the user's ID Token in the request so we're authorized
            Authorization: `Bearer ${user.idToken}`,
            "Content-Type": file.type,
          },
        });
      };

      //=========================
      //Read as an Array Buffer!!
      reader.readAsArrayBuffer(file);
    }
  };

  document.querySelector("#input-file").addEventListener("change", handleFile);

  //================================================
  //Get Fragments and Display

  listBtn.onclick = async () => {
    document.getElementById("p").innerHTML = "";

    try {
      const res = await fetch(`${apiUrl}/v1/fragments/?expand=1`, {
        headers: {
          // Include the user's ID Token in the request so we're authorized
          Authorization: `Bearer ${user.idToken}`,
        },
      });
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}`);
      }
      const data = await res.json();

      for (const fragment of data.fragments) {
        if ((images = document.querySelector(".FragmentImage")))
          images.parentNode.removeChild(images);
      }

      for (const fragment of data.fragments) {
        try {
          const res = await fetch(`${apiUrl}/v1/fragments/${fragment.id}`, {
            headers: {
              // Include the user's ID Token in the request so we're authorized
              Authorization: `Bearer ${user.idToken}`,
            },
          });
          if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
          }

          if (fragment.type.startsWith("image")) {
            let data = await res.arrayBuffer();

            let binary = Buffer.from(data);

            let imgData = new Blob([binary], {
              type: fragment.type,
            });

            let img = new Image();

            //https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
            //=========================
            //Read as an DataURL!!
            const reader = new FileReader();
            reader.addEventListener(
              "load",
              function () {
                img.src = reader.result;
                img.className = "FragmentImage";
                img.alt = fragment.id;
              },
              false
            );

            if (imgData) {
              reader.readAsDataURL(imgData);
            }

            document.body.appendChild(img);
          }

          //===========================
          // Display Text

          if (
            fragment.type.startsWith("text") ||
            fragment.type.startsWith("application")
          ) {
            let data = await res.text();

            let paragraph = document.getElementById("p");

            let text = document.createTextNode(
              "ID: " + fragment.id + " Fragment Data: " + data
            );

            paragraph.appendChild(text);
            let elem = document.createElement("hr");
            elem.setAttribute("width", "100px");
            paragraph.appendChild(elem);
          }

          // console.log("Got user fragments metadata", { data });
        } catch (err) {
          console.error("Unable to call GET /v1/fragments/:id", { err });
        }
      }
    } catch (err) {
      console.error("Unable to call GET /v1/fragments?expand=1", { err });
    }
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
