import { API_BASE_URL } from "./constants";

// Define an API function to fetch transactions
export async function fetchTransactions() {
  try {
    const response = await fetch(`${API_BASE_URL}/bank/transactions`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error; // Re-throwing the error for handling at a higher level
  }
}
// post request Transaction
export async function createTransactions(formObject) {
  try {
    const response = await fetch(`${API_BASE_URL}/bank/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transaction: formObject }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error; // Re-throwing the error for handling at a higher level
  }
}

// Define an API function to fetch transfers
export async function fetchTransfer() {
  try {
    const response = await fetch(`${API_BASE_URL}/bank/transfers`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching transfers:", error);
    throw error; // Re-throwing the error for handling at a higher level
  }
}

// post request Transfers
export async function createTransfers(formObject) {
  try {
    const response = await fetch(`${API_BASE_URL}/bank/transfers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transfer: formObject }),
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching transfers:", error);
    throw error; // Re-throwing the error for handling at a higher level
  }
}

// Define an API function to fetch transaction Details
export async function fetchTransactionDetails(transactionId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/bank/transactions/${transactionId}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching transaction:", error);
    throw error; // Re-throwing the error for handling at a higher level
  }
}

// Define an API function to fetc transfer Details
export async function fetchTransferDetails(transferId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/bank/transfers/${transferId}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching transfer:", error);
    throw error; // Re-throwing the error for handling at a higher level
  }
}

//mark paid off transactions
export async function markPaidOff(transactionId, paidOffFlag) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/bank/transactions/${transactionId}/markPaidOff`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paidOffFlag }),
      }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to mark transaction as paid off: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error marking transaction as paid off:", error);
    throw error;
  }
}
