import * as React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App/App'
import './globals.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import TransactionDetail from "./components/TransactionDetail/TransactionDetail"
import TransferDetail from './components/TransferDetails/TransferDetails'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Switch>
          <Route exact path="/" component={App}/>
          <Route path="/transaction/:id" component={TransactionDetail}/>
          <Route path="/transfer/:id" component={TransferDetail}/>
      </Switch>
    </Router>
  </React.StrictMode>,
)
