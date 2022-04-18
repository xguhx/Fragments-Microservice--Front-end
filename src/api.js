// src/api.js

// fragments microservice API
const apiUrl = process.env.API_URL;

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log("Requesting user fragments data...");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      headers: {
        // Include the user's ID Token in the request so we're authorized
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Got user fragments data", { data });
  } catch (err) {
    console.error("Unable to call GET /v1/fragments", { err });
  }
}

export function appendingImg(imgData, img, fragment) {
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

export async function convertFragments(document, user, selectFormat) {
  try {
    const res = await fetch(
      `${apiUrl}/v1/fragments/${document.querySelector("#fragmentId").value}${
        selectFormat.options[selectFormat.selectedIndex].value
      }`,
      {
        headers: {
          // Include the user's ID Token in the request so we're authorized
          Authorization: `Bearer ${user.idToken}`,
        },
      }
    );
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

    if (
      selectFormat.options[selectFormat.selectedIndex].value == ".html" ||
      selectFormat.options[selectFormat.selectedIndex].value == ".plain" ||
      selectFormat.options[selectFormat.selectedIndex].value == ".json"
    ) {
      console.log("IM INSIDE TEXT");
      let data = await res.text();

      let paragraph = document.getElementById("p");

      let text = document.createTextNode(
        "ID: " +
          document.querySelector("#fragmentId").value +
          " Fragment Data: " +
          data
      );

      paragraph.appendChild(text);
      let elem = document.createElement("hr");
      elem.setAttribute("width", "100px");
      paragraph.appendChild(elem);
    } else {
      console.log("IM INSIDE IMAGE");
      data = await res.arrayBuffer();
      let binary = Buffer.from(data);
      let imgData = new Blob([binary], {
        type: `image/${selectFormat.options[
          selectFormat.selectedIndex
        ].value.substring(1)}`,
      });

      let img = new Image();

      appendingImg(imgData, img, document.querySelector("#fragmentId").value);
    }
  } catch (err) {
    console.log("Error converting  fragments: ", {
      err,
    });
  }
}

export async function getMetadata(user) {
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
}

export async function postFragment(user, document, selectMethod, select) {
  if (
    !document.querySelector("#fragment").value.length &&
    (selectMethod.options[selectMethod.selectedIndex].value == "POST" ||
      selectMethod.options[selectMethod.selectedIndex].value == "PUT")
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
}

export async function handleFileUpload(event, user) {
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
    //Read Array as an Array Buffer!!
    reader.readAsArrayBuffer(file);
  }
}

export async function displayFragments(user, document) {
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

          appendingImg(imgData, img, fragment);
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
}
