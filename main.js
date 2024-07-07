document.getElementById("card-number").addEventListener("input", function (e) {
  let input = e.target.value.replace(/\D/g, ""); // Remove all non-digit characters
  input = input.substring(0, 16); // Limit to 16 digits
  input = input.match(/.{1,4}/g)?.join(" ") ?? input; // Add spaces every 4 digits
  e.target.value = input;
  console.log(input);
});

document.getElementById("expiry-date").addEventListener("input", function (e) {
  let input = e.target.value.replace(/\D/g, ""); // Remove all non-digit characters
  if (input.length > 2) {
    input = input.substring(0, 2) + "/" + input.substring(2, 4); // Insert slash after 2 digits
  }
  e.target.value = input.substring(0, 5); // Limit to 5 characters
});

document
  .getElementById("payment-amount")
  .addEventListener("input", function (e) {
    let input = e.target.value.replace(/\s+/g, ""); // Remove all spaces
    input = input.replace(/\D/g, ""); // Remove all non-digit characters
    input = input.replace(/\B(?=(\d{3})+(?!\d))/g, " "); // Add spaces every 3 digits
    e.target.value = input;
  });

document
  .getElementById("confirmation-code")
  .addEventListener("input", function (e) {
    let input = e.target.value.replace(/\D/g, ""); // Remove all non-digit characters
    input = input.substring(0, 6); // Limit to 16 digits
    e.target.value = input;
  });

document
  .getElementById("payment-button")
  .addEventListener("click", function (e) {
    e.preventDefault();
    const author = "John";
    let amount = document
      .getElementById("payment-amount")
      .value.replace(/\s+/g, "");
    const message = "Example";
    createPaymentId(author, amount, message);
  });
async function createPaymentId(author, amount, message) {
  const url = `https://u13588.xvest1.ru/example-payment/create-pay-id.php?author=${author}&sum=${amount}&message=${message}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error creating payment ID: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data.temporary_pay_id); 
    // return data.temporary_pay_id;
  } catch (error) {
    console.error("Error:", error);
  }
}
async function createPaymentCode(cardNumber, expire, paymentId) {
  const url = `/create-pay-code.php?cardNumber=${cardNumber}&expire=${expire}&id=${paymentId}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error creating payment code: ${response.statusText}`);
    }
    const data = await response.json();
    return {
      success: data.success,
      phone: data.phone,
      bankTransId: data.bank_trans_id,
    };
  } catch (error) {
    console.error("Error:", error);
  }
}

async function verifyPayment(code, bankTransId, paymentId) {
  const url = `/payment-confirm.php?code=${code}&bankTransId=${bankTransId}&id=${paymentId}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error verifying payment: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}
