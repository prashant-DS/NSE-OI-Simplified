// popup.js
document.addEventListener("DOMContentLoaded", function () {
  fetchForIndex("BANKNIFTY", "bank");
  fetchForIndex("NIFTY", "nifty");
  fetchForIndex("MIDCPNIFTY", "midcap");
});

function fetchForIndex(index, id) {
  console.log(
    `https://www.nseindia.com/api/option-chain-indices?symbol=${index}`
  );
  fetch(`https://www.nseindia.com/api/option-chain-indices?symbol=${index}`)
    .then((response) => response.json())
    .then((data) => {
      // console.log("🥳 ~ file: popup.js:14 ~ .then ~ data:", data);
      const {
        strikePriceMaxCE,
        strikePriceMaxPE,
        maxCEOpenInterest,
        maxPEOpenInterest,
      } = getMaxOE(data);

      document.getElementById(id + "ResOI").textContent = maxCEOpenInterest;
      document.getElementById(id + "ResPrice").textContent = strikePriceMaxCE;

      document.getElementById(id + "CurrentPrice").textContent =
        Math.round(data.records?.index?.last) ||
        Math.round(data.records?.underlyingValue) ||
        "-";

      document.getElementById(id + "SuppOI").textContent = maxPEOpenInterest;
      document.getElementById(id + "SuppPrice").textContent = strikePriceMaxPE;
    })
    .catch((error) => {
      console.error("Error fetching data from the API:", error);
      document.body.textContent =
        "Error fetching data from the API   : :   " + error.message;
    });
}

function getMaxOE(data) {
  let maxCEOpenInterest = 0;
  let maxPEOpenInterest = 0;
  let strikePriceMaxCE = null;
  let strikePriceMaxPE = null;

  data.filtered.data.forEach((option) => {
    // Check for max openInterest in CE
    if (option.CE && option.CE.openInterest > maxCEOpenInterest) {
      maxCEOpenInterest = option.CE.openInterest;
      strikePriceMaxCE = option.CE.strikePrice;
    }

    // Check for max openInterest in PE
    if (option.PE && option.PE.openInterest > maxPEOpenInterest) {
      maxPEOpenInterest = option.PE.openInterest;
      strikePriceMaxPE = option.PE.strikePrice;
    }
  });
  return {
    maxCEOpenInterest,
    maxPEOpenInterest,
    strikePriceMaxCE,
    strikePriceMaxPE,
  };
}
