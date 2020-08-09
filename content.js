chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.txt == "currencyConverter") {
    convertPrice(message.rate);
  }
});

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((msg) => {
    if (msg.function == "html") {
      port.postMessage({
        html: document.documentElement.outerHTML,
        description: document
          .querySelector("meta[name='description']")
          .getAttribute("content"),
        title: document.title,
      });
    }
  });
});

const convertPrice = (rate) => {
  var searchText = "$";
  var separator = "-";

  var cssNames = [
    "a-color-price",
    "a-price-whole",
    "a-color-base",
    "twisterSwatchPrice",
    "p13n-sc-price",
    "priceBlockStrikePriceString",
    "a-offscreen",
    "dealPriceText",
    "header-price",
    "abb-option-list-price",
  ];

  cssNames
    .map((className) => document.getElementsByClassName(className))
    .forEach((aTags) => {
      for (var i = 0; i < aTags.length; i++) {
        const textContent = aTags[i].textContent;
        if (textContent.includes(searchText)) {
          let priceNumber = textContent.replace(searchText, "");
          priceNumber = parseFloat(priceNumber) * rate;
          aTags[i].textContent = priceNumber.toLocaleString("en-US", {
            style: "currency",
            currency: "INR",
          });
        }
      }
    });
};
