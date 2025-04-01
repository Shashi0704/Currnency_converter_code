const BASE_URL = "https://2024-03-06.currency-api.pages.dev/v1/currencies";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency codes
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if ((select.name === "from" && currCode === "USD") ||
        (select.name === "to" && currCode === "INR")) {
      newOption.selected = true;
    }
    select.append(newOption);
  }
  select.addEventListener("change", (evt) => updateFlag(evt.target));
}

// Function to update flag images
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  if (img) img.src = newSrc;
};

// Fetch exchange rates and update message
btn.addEventListener("click", async (evt) => {
  evt.preventDefault();
  
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value || "1";
  if (amtVal < 1) {
    amtVal = "1";
    amount.value = "1";
  }

  const fromCurrency = fromCurr.value.toLowerCase();
  const toCurrency = toCurr.value.toLowerCase();
  const URL = `${BASE_URL}/${fromCurrency}.json`;

  let response = await fetch(URL);
  if (!response.ok) return; // Stops execution if the request fails

  let data = await response.json();
  if (!data[fromCurrency] || !data[fromCurrency][toCurrency]) return; // Ensures valid currency conversion

  let rate = data[fromCurrency][toCurrency];
  let finalAmount = (amtVal * rate).toFixed(2);
  msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
});
