(function () {
  window.addEventListener("load", function () {
    console.log("WhatsApp Button Loaded");

    // 1. Guard first — skip non-product pages immediately
    if (!document.querySelector('form[action*="/cart/add"]')) return;

    function waitForProductTitle(callback, maxTicks = 40) {
      let lastTitle = "";
      let ticks = 0;
      const interval = setInterval(() => {
        ticks++;
        const el = document.querySelector("h1");
        const currentTitle = el?.innerText?.trim();

        // 2. Timeout safety
        if (ticks >= maxTicks) {
          clearInterval(interval);
          callback(); // proceed anyway with whatever title we have
          return;
        }

        if (!currentTitle) return;

        if (currentTitle === lastTitle) {
          clearInterval(interval);
          callback();
        }
        lastTitle = currentTitle;
      }, 150);
    }

    function initWhatsAppButton() {
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

      const config = window.WhatsAppConfig || {};
      const phoneNumber = (config.phone || "51999999999").replace(/\D/g, "");
      
      // 3. Use config template as the single source of truth
      let template =
        config.messageTemplate ||
        "Hola, estoy interesado en este producto:|{{product}}|Precio: {{price}}|{{url}}";

      const finalMessage = template
        .replace("{{product}}", productTitle)
        .replace("{{price}}", productPrice || "Consultar precio")
        .replace("{{url}}", productUrl)
        .replace(/\|/g, "\n");

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(finalMessage)}`;

      let button = document.getElementById("wa-button-custom");
      if (!button) {
        button = document.createElement("a");
        button.id = "wa-button-custom";
        button.target = "_blank";
        button.rel = "noopener noreferrer"; // 4. Security best practice for target="_blank"
        button.innerHTML = `
          <span style="display:flex; align-items:center; justify-content:center; gap:8px;">
            <span>💬</span>
            <span>Comprar por WhatsApp</span>
          </span>
        `;
        Object.assign(button.style, {
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "12px 16px",
          borderRadius: "50px",
          backgroundColor: "#25D366",
          color: "#fff",
          fontWeight: "600",
          fontSize: "16px",
          textDecoration: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          zIndex: "9999",
          maxWidth: "90%",
          transition: "background-color 0.2s ease", // 5. Smooth hover
        });
        button.addEventListener("mouseover", () => { button.style.backgroundColor = "#1ebe5d"; });
        button.addEventListener("mouseout", () => { button.style.backgroundColor = "#25D366"; });
        document.body.appendChild(button);
      }

      button.href = whatsappUrl;
      console.log("FINAL MESSAGE:", finalMessage);
    }

    waitForProductTitle(initWhatsAppButton);
  });
})();
