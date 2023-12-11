// popup.js
document.addEventListener("DOMContentLoaded", function () {
  // Check if the data is present in localStorage
  const myData = localStorage.getItem("yourDataKey");

  // Check if the data is present and display accordingly
  if (myData) {
    contentDiv.textContent = `Data found: ${myData}`;
  } else {
    // Data not found, make a request to your API endpoint
    fetch("https://www.nseindia.com/api/option-chain-indices?symbol=BANKNIFTY")
      .then((response) => response.json())
      .then((data) => {
        const {
          strikePriceMaxCE,
          strikePriceMaxPE,
          maxCEOpenInterest,
          maxPEOpenInterest,
        } = getMaxOE(data);

        console.log(
          "Strike Price for Max Open Interest in CE:",
          strikePriceMaxCE,
          maxCEOpenInterest
        );
        console.log(
          "Strike Price for Max Open Interest in PE:",
          strikePriceMaxPE,
          maxPEOpenInterest
        );

        // final
        document.getElementById("bankResOI").textContent = maxCEOpenInterest;
        document.getElementById("bankResPrice").textContent = strikePriceMaxCE;

        document.getElementById("bankCurrentPrice").textContent =
          data.records.index.last;

        document.getElementById("bankSuppOI").textContent = maxPEOpenInterest;
        document.getElementById("bankSuppPrice").textContent = strikePriceMaxPE;
      })
      .catch((error) => {
        console.error("Error fetching data from the API:", error);
        contentDiv.textContent = "Error fetching data from the API";
      });
  }

  document
    .getElementById("refreshAllButton")
    .addEventListener("click", function () {
      chrome.runtime.reload();
    });
});

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
