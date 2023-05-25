# Bank of CodePath Lab

## Overview

For this lab, you'll build the UI for a new financial application that CodePath has been prototyping. It's a simple banking app that helps users keep track of their finances and payments using an Express API and a React UI.

Your job is to wire up the React UI to interact with a provided Express API. Data in the Express API is persisted using a JSON file that will store all user activity.

## Application Features

### Core Features

- [ ] Users can add new transaction to bank with a description, category, and amount.
- [ ] The currency of the transaction amount is specified (i.e., USD, cents, etc.).
- [ ] New transactions are updated in the activity section with most recent at the bottom.
- [ ] Users can search for transactions that match key words or phrases.

### Stretch Features

- [ ] Display the current total balance of the user's bank account on the home page.
- [ ] Implement an `AddTransfer` component that allows users to add a transfer to their bank account.
- [ ] Create a `TransferDetail` component that displays information about an individual transfer.
- [ ] Ensure that the `FilterInput` filters both transactions and transfers.
- [ ] Add an API endpoint that allows users to indicate that they've paid off certain transactions if that transaction took money out of the account. Create a button on the `TransactionDetail` component that lets users record this information.
