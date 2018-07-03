// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import createAccount from './createAccount.duck';
import message from './message.duck';
import sendTezos from './sendTezos.duck';
import delegate from './delegate.duck';
import nodes from '../redux/nodes/reducers';
import wallet from '../redux/wallet/reducers';

const rootReducer = combineReducers({
  createAccount,
  message,
  sendTezos,
  delegate,
  nodes,
  wallet,
  router
});

export default rootReducer;
