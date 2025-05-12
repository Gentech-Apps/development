import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { routerMiddleware, ConnectedRouter } from 'connected-react-router';
import reduxThunk from 'redux-thunk';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import history from './services/history';
import reducers from './reducers/reducers';
import './sass/main/index.scss';
// import { Redirect } from 'react-router'
// import DragAndDrop from "./components/Dashboard/Parts/DragAndDrop/DragAndDrop"
import { polyfill } from 'es6-promise';
import App from '../src/App';
import { refreshPageAfterAwake } from './functions/general/refreshPageAfterAwake';
polyfill();
refreshPageAfterAwake();
//  let history = createBrowserHistory();

const store = createStore(
  reducers(history),
  {},
  compose(applyMiddleware(routerMiddleware(history), reduxThunk)),
);

// store.subscribe(()=>console.log('STORE --->',store.getState()))

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <BrowserRouter history={history}>
        <App />
      </BrowserRouter>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);

// ReactDOM.render(
//     <Provider store={store}>
//         <ConnectedRouter history={history}>
//             <Router>
//                 <Redirect to="/" />
//                 <Switch>
//                     <Route exact  path="/" exact component={LoginRedirector} />
//                     <Route exact  path="/login" exact component={Login} />
//                     <Route exact  path="/dashboard" exact component={Dashboard} />

//                 </Switch>
//             </Router>
//         </ConnectedRouter>
//     </Provider>,
//     document.getElementById("root")
// )

serviceWorker.register();
