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
      console.log("🥳 ~ file: popup.js:14 ~ .then ~ data:", id, data);
      const {
        maxCEOpenInterest,
        maxCETradedVolume,
        maxPEOpenInterest,
        maxPETradedVolume,
      } = getMaxOE(data);

      const oiResRow = document.getElementsByClassName(id + "-max-oi-res")[0];
      if (!oiResRow) return;

      oiResRow.insertCell().textContent =
        maxCEOpenInterest.CE.openInterest.toLocaleString() + " ⇧";
      oiResRow.insertCell().textContent =
        maxCEOpenInterest.CE.totalTradedVolume.toLocaleString();
      oiResRow.insertCell().textContent =
        maxCEOpenInterest.strikePrice.toLocaleString();
      oiResRow.insertCell().textContent = "";
      oiResRow.insertCell().textContent = "";

      // checking for ce volume
      if (maxCETradedVolume.strikePrice !== maxCEOpenInterest.strikePrice) {
        const row = document.createElement("tr");
        row.classList.add("red-row");
        row.insertCell().textContent =
          maxCETradedVolume.CE.openInterest.toLocaleString();
        row.insertCell().textContent =
          maxCETradedVolume.CE.totalTradedVolume.toLocaleString() + " ⇧";
        row.insertCell().textContent =
          maxCETradedVolume.strikePrice.toLocaleString();
        row.insertCell().textContent = "";
        row.insertCell().textContent = "";

        if (maxCETradedVolume.strikePrice > maxCEOpenInterest.strikePrice) {
          oiResRow.insertAdjacentElement("beforebegin", row);
        } else {
          oiResRow.insertAdjacentElement("afterend", row);
        }
      } else {
        document.getElementsByClassName(
          id + "-max-oi-res"
        )[0].children[1].textContent += " ⇧";
      }

      document.getElementById(id + "CurrentPrice").textContent = (
        Math.round(data.records?.index?.last) ||
        Math.round(data.records?.underlyingValue) ||
        "-"
      ).toLocaleString();

      const oiSuppRow = document.getElementsByClassName(id + "-max-oi-supp")[0];
      oiSuppRow.insertCell().textContent = "";
      oiSuppRow.insertCell().textContent = "";
      oiSuppRow.insertCell().textContent =
        maxPEOpenInterest.strikePrice.toLocaleString();
      oiSuppRow.insertCell().textContent =
        maxCEOpenInterest.PE.totalTradedVolume.toLocaleString();
      oiSuppRow.insertCell().textContent =
        maxPEOpenInterest.PE.openInterest.toLocaleString() + " ⇧";

      // checking for pe volume
      if (maxPETradedVolume.strikePrice !== maxPEOpenInterest.strikePrice) {
        const row = document.createElement("tr");
        row.classList.add("green-row");
        row.insertCell().textContent = "";
        row.insertCell().textContent = "";
        row.insertCell().textContent =
          maxPETradedVolume.strikePrice.toLocaleString();
        row.insertCell().textContent =
          maxPETradedVolume.CE.totalTradedVolume.toLocaleString() + " ⇧";
        row.insertCell().textContent =
          maxPETradedVolume.CE.openInterest.toLocaleString();

        if (maxPETradedVolume.strikePrice < maxPEOpenInterest.strikePrice) {
          oiSuppRow.insertAdjacentElement("beforebegin", row);
        } else {
          oiSuppRow.insertAdjacentElement("afterend", row);
        }
      } else {
        document.getElementsByClassName(
          id + "-max-oi-supp"
        )[0].children[3].textContent += " ⇧";
      }
    })
    .catch((error) => {
      console.error("Error fetching data from the API in :", id, error);
      document.getElementById(id).textContent =
        "Error fetching data from the API";
    });
}

function getMaxOE(data) {
  let maxCEOpenInterest = { CE: { openInterest: 0 } };
  let maxPEOpenInterest = { PE: { openInterest: 0 } };
  let maxCETradedVolume = { CE: { totalTradedVolume: 0 } };
  let maxPETradedVolume = { PE: { totalTradedVolume: 0 } };

  data.filtered.data.forEach((option) => {
    // Check for max openInterest in CE
    if (
      option.CE &&
      option.CE.openInterest > maxCEOpenInterest.CE.openInterest
    ) {
      maxCEOpenInterest = { ...option };
    }

    // Check for max traded volume in CE
    if (
      option.CE &&
      option.CE.totalTradedVolume > maxCETradedVolume.CE.totalTradedVolume
    ) {
      maxCETradedVolume = { ...option };
    }

    // Check for max openInterest in PE
    if (
      option.PE &&
      option.PE.openInterest > maxPEOpenInterest.PE.openInterest
    ) {
      maxPEOpenInterest = { ...option };
    }

    // Check for max traded volume inPCE
    if (
      option.PE &&
      option.PE.totalTradedVolume > maxPETradedVolume.PE.totalTradedVolume
    ) {
      maxPETradedVolume = { ...option };
    }
  });

  return {
    maxCEOpenInterest,
    maxCETradedVolume,
    maxPEOpenInterest,
    maxPETradedVolume,
  };
}
