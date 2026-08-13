/* =================================
   WBM.NET - APP.JS
================================= */


/* =================================
   SERVICE WORKER / PWA
================================= */

if ("serviceWorker" in navigator) {

  window.addEventListener("load", () => {

    navigator.serviceWorker
      .register("serviceworker.js")
      .then((registration) => {

        console.log(
          "Service Worker berhasil:",
          registration.scope
        );

      })
      .catch((error) => {

        console.error(
          "Service Worker gagal:",
          error
        );

      });

  });

}


/* =================================
   PWA INSTALL
================================= */

let deferredPrompt = null;

const installBtn =
  document.getElementById("installBtn");


window.addEventListener(
  "beforeinstallprompt",
  (event) => {

    event.preventDefault();

    deferredPrompt = event;

    if (installBtn) {
      installBtn.style.display = "inline-block";
    }

  }
);


/* =================================
   INSTALL APP
================================= */

if (installBtn) {

  installBtn.addEventListener(
    "click",
    async () => {

      if (!deferredPrompt) {
        return;
      }

      deferredPrompt.prompt();

      const result =
        await deferredPrompt.userChoice;

      console.log(
        "Install App:",
        result.outcome
      );

      deferredPrompt = null;

      installBtn.style.display = "none";

    }
  );

}


/* =================================
   AFTER APP INSTALLED
================================= */

window.addEventListener(
  "appinstalled",
  () => {

    console.log(
      "WBM.NET berhasil diinstall sebagai PWA."
    );

    deferredPrompt = null;

    if (installBtn) {
      installBtn.style.display = "none";
    }

  }
);
