// Declare a variable to store the exchange rate globally
let exchangeRate = null;

// Function to fetch the exchange rate (USD to INR)
async function fetchExchangeRate() {
    const apiKey = '5b290365d3714ad69d5a7b73e5388ab3'; // Replace with your Open Exchange Rates API key
    const url = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}&symbols=USD,INR`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.rates && data.rates.INR) {
            // Store the USD to INR rate in the global variable
            exchangeRate = data.rates.INR;

            // Display exchange rate
            document.getElementById("exchange-rate").innerText = exchangeRate;

        } else {
            alert("Failed to fetch exchange rate.");
        }
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        alert("Error fetching exchange rate.");
    }
}

// Function to convert the gold price to INR
async function convertPrice() {
    // Ensure that the exchange rate is already fetched before conversion
    if (exchangeRate === null) {
        alert("Exchange rate not fetched yet.");
        return;
    }

    // Get the input gold price in USD per ounce
    let goldPriceUSD = parseFloat(document.getElementById("gold-price").value);

    if (isNaN(goldPriceUSD) || goldPriceUSD <= 0) {
        alert("Please enter a valid gold price.");
        return;
    }

    // Constants
    const OUNCE_TO_GRAMS = 31.1035;
    const IMPORT_DUTY_TAX = 1.06; // 5% import duty + 1% Agriculture & infrastructure cess
    const GST_TAX = 1.03; // 3% GST

    // Conversion steps
    let pricePerGramUSD = goldPriceUSD / OUNCE_TO_GRAMS; // Price per gram in USD
    let pricePerGramINR = pricePerGramUSD * exchangeRate; // Price per gram in INR
    let priceWithoutGST = pricePerGramINR * IMPORT_DUTY_TAX; // Price per gram without GST
    let finalPriceWithGST = priceWithoutGST * GST_TAX; // Price with GST

    // Display the result
    document.getElementById("price-inr-without-gst").innerText = `Price without GST: ₹ ${priceWithoutGST.toFixed(2)}`;
    document.getElementById("price-inr-with-gst").innerText = `Price with GST: ₹ ${finalPriceWithGST.toFixed(2)}`;
}

// Fetch the exchange rate when the page loads
window.onload = async function() {
    await fetchExchangeRate(); // Fetch the exchange rate when the page is loaded
};

document.getElementById('gold-price').addEventListener('keypress', function(event) {
    // Check if the pressed key is 'Enter' (key code 13)
    if (event.key === 'Enter') {
        convertPrice(); // Trigger the conversion function
    }
});