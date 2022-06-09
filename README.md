# Bank of CodePath Lab

## Overview

For this activity, you'll be building out the UI for a new financial application that Codepath has been prototyping. It's a simple banking app that helps users keep track of their finances and payments using an Express API and a React UI.

Your job is to wire up the React UI to interact with the already built Express API. Data in the Express API is persisted using a JSON file that will store all user activity.

## Project Details

### Goals

By the end of this lab you will be able to...
- [ ] Make HTTP requests from React applications using `axios`
- [ ] Handle asynchronous functions using `async/await`
- [ ] Leverage the `useEffect` hook to make API requests when components mount
- [ ] Store data pulled from a remote API locally with the `useState` hook
- [ ] Create `onClick` handlers for buttons
- [ ] Manage the internal state of a form input with use state and an `onChange` handler.
- [ ] Create `onSubmit` handlers for forms
- [ ] Use React Router to navigate between pages
- [ ] Create dynamic routes with React Router
- [ ] Craft HTTP requests that use route parameter from the `useParams` hook

### Application Features

#### Core Features

- [ ] Users can add new transaction to bank: Takes in description, category, and amount. Be sure to specify what unit of currency the amount is in (i.e USD, cents, etc.)
- [ ] New transactions will be updated in the activity section with most recent at the bottom.
- [ ] Allows users to search in activities based on key words or phrases.

#### Stretch Features
- [ ] Display the current total balance of the user's bank account on the Home Page.
- [ ] Implement an `AddTransfer` component that allows users to add a transfer to their bank account.
- [ ] Create a `TransferDetail` component that displays info about an individual transfer.
- [ ] Ensure that the `FilterInput` filters both transactions and transfers.
- [ ] Add an API endpoint that allows users to indicate that they've paid off certain transactions if that transaction took money out of the account. Create a button on the `TransactionDetail` component that lets users record this information.

:::info
💡 **Note:** The API has already been provided and is fully functional as is. Feel free to explore the backend to see what routes are available and how the `Bank` model and `Storage` class stores and accesses data from the `db.json` file.
:::

### Step 0: Project Setup (5 mins)</span>

#### TDD Lab

There are two things to be aware of when implementing code for this lab:

#### 1. Rendering a test environment

In the `main.jsx` file, the core `<App />` component isn't being rendered as it usually is.

Instead, we see this:

```jsx
const renderApp = () =>
  ReactDOM.render(
    <React.StrictMode>
      <App />
      {/* Leave this here for live test environment */}
      <InstantNoodles RootComponent={App} tests={tests} config={config} />
    </React.StrictMode>,
    document.getElementById("root")
  )

/* Comment out this next line to run against live Express API */
prepareMockServiceWorker().then(() => renderApp())
/* Uncomment this next line to run against live Express API */
// renderApp()
```

The actual rendering of the React app is done in a function so that the test environment can be setup with a mock service worker that will intercept `axios` requests for testable and reproducible API behavior. Once that setup is complete, then the application will be rendered the screen. To see the application running live against the real Express api, comment out the line with `prepareMockServiceWorker` and uncomment the line that only has the code: `renderApp()`.

#### 2. Tests might run differently on different routes

Don't be alarmed if some tests aren't passing when navigating to a route different from the home `/` route. This is due to a limitation with React test rendering behavior.

:::info
💡 **Tip:** Anytime tests that were passing before are no longer passing, navigate back to the `/` route and refresh the page.
:::

---

#### 📢 Now it’s your turn!  

Start by installing the core dependencies for this project.

- [ ] Navigate into the `bank-of-codepath-express-api` directory and run `npm install` to get the appropriate dependencies. Make sure the express server is running with `npm run dev` or `npm start` in the `api` directory.
- [ ] In a new terminal window, navigate into the `bank-of-codepath-ui` directory and run `npm install` to download the frontend dependencies. - [ ] Run `npm run dev` to get the React app started up.
- [ ] Open up `http://localhost:3000` in the browser to see the current state of the app. The API should be running at `http://localhost:3001`. That value is also stored in the `API_BASE_URL` variable inside the `constants.js` file in the frontend repo.
  - The tests will run immediately as soon as the frontend starts up.
  - They should all be failing, but that's ok. We'll use them to guide our development during this lab.
  - Every time a file is updated, the tests will be re-run.


### Step 2: The `App.jsx` component

  - [ ] Route Components
    - [ ] Import the `BrowserRouter`, `Routes`, and `Route` components from `react-router-dom`
    - [ ] Inside the `return` statement in the `App.jsx` component, nest the `BrowserRouter` component inside the `div` element with a `className` of `app`.
    - [ ] Nest the `Navbar` component inside the `BrowserRouter` component.
    - [ ] Place the `Home` component inside a `main` tag that is rendered directly after the `Navbar` component.
  - [ ] Define routes
    - [ ] Make the first child of the `main` tag the `Routes` component from `react-router-dom`.
    - [ ] Use the `Route` component to add an index route for the `Home` component at the `/` route
    - [ ] Import the `TransactionDetail` component into the `App.jsx` component.
    - [ ] Add a dynamic route with the base path of `transactions` that is used for displaying a single transaction with the `transactionId` path parameter. Display that page with the `TransactionDetail` component.
  - [ ] State variables
    - [ ] Create default state and handlers with React's `useState` hook for the following items. These won't cause any tests to pass, but we'll need them for the upcoming tests
      - [ ] `isLoading` - a boolean representing whether or not the app is currently requesting data from the API
      - [ ] `transactions` - the list of bank transaction items fetched from the API
      - [ ] `transfers` - the list of bank transfer items fetched from the API
      - [ ] `error` - any errors associated with fetching data from the API
      - [ ] `filterInputValue` - a string value used to create a controlled input in the `FilterInput.jsx` component

### Step 3: The `Navbar.jsx` and `FilterInput.jsx` components

#### Inside the `Navbar.jsx` component:
    
  - [ ] Render a nav link
    - [ ] Render the `Logo` component as the first element nested inside the `nav` element
    - [ ] Inside the `Logo` component, wrap the `img` element with a `Link` component from `react-router-dom`.
    - [ ] Pass a `path` prop to the `Logo` component that corresponds to the `Home` route. Then pass that as the `to` prop in the `Link` component
    - [ ] Clicking on the `img` element in the `Navbar` should now redirect to the Home route. Manually navigate to a different path and try it out in the browser.

#### In the `App.jsx` component:
    
  - [ ] Pass props
    - [ ] Go ahead and pass the `filterInputValue` to the `Navbar` as the `filterInputValue` prop
    - [ ] Name the state updater function for that variable: `setFilterInputValue`. Pass that function to the `Navbar` as its `setFilterInputValue` prop.

#### Inside the `Navbar.jsx` component:
    
  - [ ] Create a controlled input
    - [ ] Pass the `filterInputValue` to the `FilterInput.jsx` component as its `inputValue` prop.
    - [ ] Define a function called `handleOnInputChange` that takes in a `change` event and calls the `setFilterInputValue` function with the new input value extracted from the event.
    - [ ] Pass the `handleOnInputChange` function to the `FilterInput.jsx` component as its `handleOnChange` prop.

#### Inside the `FilterInput.jsx` component:
    
  - [ ] Create a controlled input
    - [ ] Pass the appropriate props to the `input` element to create a controlled input.
    - [ ] Typing into the input should now update state. Use the React devtools to confirm this

### Step 4: The `Home.jsx` component

#### In the `App.jsx` component
  - [ ] Pass props
    - [ ] Pass the state variables and updater functions as props to the `Home.jsx` component as needed:
      - `transactions`
      - `setTransactions`
      - `transfers`
      - `setTransfers`
      - `error`
      - `setError`
      - `isLoading`
      - `setIsLoading`
      - `filterInputValue`

#### In the `Home.jsx` component
  - [ ] Fetch data
    - [ ] Create a `useEffect` hook that runs whenever the `Home.jsx` component is mounted to the screen
      - [ ] When the effect kicks off, it should set `isLoading` to true
      - [ ] That function should fetch all transactions and transfers from the API. You can either create two separate `useEffect` hooks to accomplish this, or do them both in the same hook. Either way, make sure to send two HTTP requests to the `/transactions` and `/transfers` endpoints with the `axios.get` method.
      - [ ] If an error occurs while fetching data, it should be added to state.
      - [ ] When data is returned from fetching data, it should be set in state accordingly.
      - [ ] When the function has finished executing, it should set `isLoading` to false
      - [ ] Make sure to call the function at the end of the `useEffect` hook.
  - [ ] Custom rendering
    - [ ] Loading
      - [ ] While the app is fetching data, the `Home.jsx` component should have an `isLoading` prop equal to `true`.
        - [ ] When that prop is `true`, it should render an `h1` element with the text: `"Loading..."
        - [ ] Otherwise, render the `BankActivity` component. It should always render the `AddTransaction` component.
    - Error
      - [ ] If the `Home.jsx` component receives any defined value for its `error` prop, it should render an error message inside of an `h2` element with the className of `error`.
  - [ ] Filtering transactions
    - [ ] The `Home.jsx` component should create a `filteredTransactions` array using its `transactions` prop.
    - [ ] If its `filterInputValue` prop is NOT an empty string:
      - [ ] It should filter the transactions based on whether or not the lowercased `description` property of a transaction contains the lowercased `filterInputValue`
      - [ ] Otherwise, it should just be the raw array passed as the `transactions` prop.
    - [ ] The `filteredTransactions` array should be passed to the `BankActivity` component as its `transactions` prop.

### Step 5: The `AddTransaction.jsx` component

This component is responsible for adding a new transaction to the Bank. We'll be turning each input into a _controlled input_ and adding an `onClick` handler to the submit button to make that happen.

#### In the `App.jsx` component

  - [ ] Define state variables and pass props
    - [ ] Create a new state variable and updater function - `newTransactionForm` and `setNewTransactionForm`
      - [ ] The `newTransactionForm` state variable should be an object with 3 form fields - `category`, `description`, and `amount`
    - [ ] Also create one for the `isCreating` state with the `setIsCreating` state updater function
    - [ ] Pass all of them to the `Home.jsx` component as props
 
#### In the `Home.jsx` component

  - [ ] Pass props
      - [ ] Pass the `isCreating` and `setIsCreating` props directly to the `AddTransaction` component as props
      - [ ] Pass the `newTransactionForm` to the `AddTransaction` component as its `form` prop
      - [ ] Pass the `setNewTransactionForm` to the `AddTransaction` component as its `setForm` prop
      - [ ] Define a `handleOnSubmitNewTransaction` function and pass it to the `AddTransaction` component as the `handleOnSubmit` prop

#### In the `AddTransaction.jsx` component

  - [ ] Form management
      - [ ] Create a `handleOnFormFieldChange` function
        - [ ] It should take a `change` event as its single argument.
        - [ ] That function should then update individual fields in the form using the `change` event.
        - [ ] Pass that function to the `AddTransactionForm` component as its `handleOnFormFieldChange` prop.
        - [ ] Go ahead and pass the other required props to the `AddTransactionForm` component as indicated by the tests

#### In the `AddTransactionForm` component

  - [ ] Create controlled inputs
    - [ ] Make sure each input is given a `name` prop corresponding to the correct field in the `newTransactionForm`.
    - [ ] Give each input the correct `placeholder` and `type` props, using the tests as a guide
    - [ ] Give each input the correct `value` and `onChange` props as well
    - [ ] Test that each one works by entering text into the input and using the React devtools to ensure that the correct field in the `newTransaction` form state variable is being updated
  - [ ] Handle submit events
    - [ ] The `button` element with a `className` of `add-transaction` should get passed the `handleOnSubmit` function as its `onClick` prop

#### Back in the `Home.jsx` component

  - [ ] Handle submit events
    - [ ] The `handleOnCreateTransaction` function
      - [ ] Should be an `async` function that starts by setting `isCreating` to `true`
      - [ ] Then, it should use the `axios.post` method to issue a `POST` request to the `/transactions` endpoint with the contents of the `newTransactionForm` as its body
        - [ ] If anything goes wrong, it should call the `setError` function with the error and set `isCreating` to `false`
        - [ ] Otherwise, it should take the new transaction returned from the API and add it to the `transactions` array in state
        - [ ] Finally, it should reset the `newTransactionForm` to its original state and set `isCreating` back to `false`
  - [ ] The `AddTransaction` component should now let users submit new transactions to the backend that are stored in the database. Try running the app against the live API to see it in action.

### Step 6: The `BankActivity` component

#### Iteration in JSX

  - [ ] The `BankActivity.jsx` component should iterate over its `transactions` prop and render a `TransactionRow` for each one. That component should render JSX wrapped by an element with the `className` of `transaction-row`.
  - [ ] It should also iterate over its `transfers` prop and render a `TransferRow` for each one. That component should render JSX wrapped by an element with the `className` of `transfer-row`.

#### Dynamic `Link` component with `react-router-dom`
    
  - [ ] Import the `Link` component from `react-router-dom`
  - [ ] The `TransactionRow` component in the `BankActivity.jsx` file should render JSX wrapped by a `Link` component from `react-router-dom` that links to the correct transaction detail page
  - [ ] Make sure to dynamically create the `to` prop based on the `id` of each transaction
  - [ ] Clicking on the `TransactionRow` component should redirect to the `TransactionDetail` page for that transaction

### Step 7: The `TransactionDetail` component

  - [ ] Define state variables
    - [ ] Inside the `TransactionDetail.jsx` component, create some state variables and state updater functions:
      - [ ] `hasFetched` and `setHasFetched` - default to `false`
      - [ ] `transaction` and `setTransaction` - default to `{}`
      - [ ] `isLoading` and `setIsLoading`
      - [ ] `error` and `setError`
  - [ ] Extract url params
    - [ ] Import the `useParams` hook from `react-router-dom`
    - [ ] Use it to extract the `transactionId` from the url route and store it in the `transactionId` variable
  - [ ] Fetch resources based on url params
    - [ ] Create a `useEffect` hook inside the component. Inside it:
      - [ ] Define an async function called `fetchTransactionById`.
        - [ ] That function should start by setting `isLoading` to `true` and `hasFetched` to `false`.
        - [ ] Then it should use `axios.get` method to issue a `GET` request to the API to fetch a single transaction by its id.
        - [ ] If there is an error, set that error in state.
        - [ ] If valid data is returned, update the `transaction` state value.
        - [ ] Set `isLoading` to `false` and `hasFetched` at the end of the function no matter what.
        - [ ] Make sure to call that function at the end of the `useEffect` hook.
      - [ ] Add the `transactionId` to the `useEffect` hook's dependency array so that it runs each time the url route changes
  - [ ] Render proper component values
    - [ ] The `TransactionDetail` component should then pass the correct props to the `TransactionCard` component
    - [ ] The `TransactionCard` component should render the proper values when the `transaction` is valid
    - [ ] If no valid `transaction` is returned for that `url`, `isLoading` is `false`, and `hasFetched` is `true`, then the `TransactionCard` component should render only render the `transactionId` inside an `h3` element in the `card-header`, along with an `h1` tag that says `Not Found`.

Congrats! All tests should now be passing and the application should be fully complete. Try it out against the live API to make sure everything is working as expected!

### Stretch Features

- [ ] Display the current total balance of the user's bank account on the Home Page.
- [ ] Implement an `AddTransfer` component that allows users to add a transfer to their bank account.
- [ ] Create a `TransferDetail` component that displays info about an individual transfer.
- [ ] Ensure that the `FilterInput` filters both transactions and transfers.
- [ ] Add an API endpoint that allows users to indicate that they've paid off certain transactions if that transaction took money out of the account. Create a button on the `TransactionDetail` component that lets users record this information.
