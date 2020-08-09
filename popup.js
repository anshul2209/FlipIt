const setPrice = (rate) => {
  var span = document.getElementById("currentRate");
  span.textContent = " 1USD = " + rate + " INR";
};

const connect = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const port = chrome.tabs.connect(tabs[0].id);
    port.postMessage({ function: "html" });
    port.onMessage.addListener((response) => {
      html = response.html;
      title = response.title;
      description = response.description;
    });
  });
};
const clear = () => {
  chrome.storage.sync.clear(function (obj) {
    console.log("cleared");
    var span = document.getElementById("currentRate");
    span.textContent = "";
  });
};

const sendData = () => {
  let params = {
    active: true,
    currentWindow: true,
  };
  chrome.tabs.query(params, gotTabs);
};

const gotTabs = (tabs) => {
  let message = {
    txt: "currencyConverter",
    rate: 0,
  };

  chrome.storage.sync.get(["USD_INR"], function (currencyObj) {
    if (Object.keys(currencyObj).length) {
      const rate = currencyObj.USD_INR;
      message.rate = currencyObj.USD_INR;
      setPrice(rate);
      chrome.tabs.sendMessage(tabs[0].id, message, function () {
        console.log("Success");
      });
    } else {
      console.log("Fetching Latest Rates...");
      fetch(
        "https://free.currconv.com/api/v7/convert?q=USD_INR&compact=ultra&apiKey=<CURRENCY_API_KEY>"
      )
        .then((response) => response.json())
        .then((data) => {
          // data = { USD_INR: 74.97075 }
          chrome.storage.sync.set(data, function () {
            message.rate = data.USD_INR;
            setPrice(data.USD_INR);
            chrome.tabs.sendMessage(tabs[0].id, message, function () {
              console.log("Success");
            });
          });
        });
    }
  });
};

document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.executeScript(
    null,
    {
      file: "content.js",
    },
    () => connect()
  );

  document.getElementById("reset").addEventListener("click", clear);

  document.getElementById("clickme").addEventListener("click", sendData);
});
