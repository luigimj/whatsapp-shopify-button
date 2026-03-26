(function () {
  window.addEventListener("load", function () {
    console.log("WhatsApp Button Loaded");

    function waitForProductTitle(callback) {
      let lastTitle = "";

      const interval = setInterval(() => {
        const el = document.querySelector("h1");
        const currentTitle = el?.innerText?.trim();

        if (!currentTitle) return;

        // Wait until title stabilizes
        if (currentTitle === lastTitle) {
          clearInterval(interval);
          callback();
        }

        lastTitle = currentTitle;
      }, 150);
    }

    function initWhatsAppButton() {
      // Ensure it's a product page
      if (!document.querySelector('form[action*="/cart/add"]')) return;

      // Get product info
      const productTitle =
        document.querySelector("[data-product-title]")?.innerText ||
        document.querySelector("h1.product__title")?.innerText ||
        document.querySelector("h1")?.innerText ||
        "producto";

      const productUrl = window.location.href;

      let productPrice = "";
      const priceElement =
        document.querySelector(".price-item--sale") ||
        document.querySelector(".price-item--regular") ||
        document.querySelector("[class*='price']");

      if (priceElement) {
        productPrice = priceElement.innerText.trim().replace(/\s+/g, " ");
      }

      // Config
      const config = window.WhatsAppConfig || {};
      const phoneNumber = (config.phone || "51999999999").replace(/\D/g, "");

      let template =
        config.messageTemplate ||
        "Hola, estoy interesado en este producto:|{{product}}|Precio: {{price}}|{{url}}";

      // Build message
      const finalMessage = template
        .replace("{{product}}", productTitle)
        .replace("{{price}}", productPrice || "Consultar precio")
        .replace("{{url}}", productUrl)
        .replace(/\|/g, "\n");

      const message = encodeURIComponent(finalMessage);

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;

      // Create or update button
      let button = document.getElementById("wa-button-custom");

      if (!button) {
        button = document.createElement("a");
        button.id = "wa-button-custom";
        button.target = "_blank";

        button.innerHTML = `
          <span style="display:flex; align-items:center; justify-content:center; gap:8px;">
            <span>💬</span>
            <span>Comprar por WhatsApp</span>
          </span>
        `;

        // Styles
        button.style.position = "fixed";
        button.style.bottom = "20px";
        button.style.left = "50%";
        button.style.transform = "translateX(-50%)";
        button.style.padding = "12px 16px";
        button.style.borderRadius = "50px";
        button.style.backgroundColor = "#25D366";
        button.style.color = "#fff";
        button.style.fontWeight = "600";
        button.style.fontSize = "16px";
        button.style.textDecoration = "none";
        button.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
        button.style.zIndex = "9999";
        button.style.maxWidth = "90%";

        // Hover
        button.addEventListener("mouseover", () => {
          button.style.backgroundColor = "#1ebe5d";
        });

        button.addEventListener("mouseout", () => {
          button.style.backgroundColor = "#25D366";
        });

        document.body.appendChild(button);
      }

      // Always update link
      button.href = whatsappUrl;

      // Debug (optional)
      console.log("FINAL MESSAGE:", finalMessage);
      console.log("BUTTON UPDATED:", button.href);
    }

    waitForProductTitle(() => {
      initWhatsAppButton();
    });
  });
})();
