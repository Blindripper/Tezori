import { fromJS } from 'immutable';

import actionCreator from '../utils/reduxHelpers';
import request from '../utils/request';
import ADD_ADDRESS_TYPES from '../constants/AddAddressTypes';

/* ~=~=~=~=~=~=~=~=~=~=~=~= Constants ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
const OPEN_ADD_ADDRESS_MODAL = 'OPEN_ADD_ADDRESS_MODAL';
const CLOSE_ADD_ADDRESS_MODAL = 'CLOSE_ADD_ADDRESS_MODAL';
const SET_ACTIVE_ADD_ADDRESS_TAB = 'SET_ACTIVE_ADD_ADDRESS_TAB';
const SET_IS_LOADING = 'SET_IS_LOADING';
const CLEAR_STATE = 'CLEAR_STATE';
const IMPORT_ADDRESS_URL = '/123testasd';
const UPDATE_PRIVATE_KEY = 'UPDATE_PRIVATE_KEY';
const UPDATE_PUBLIC_KEY = 'UPDATE_PUBLIC_KEY';
const UPDATE_USERNAME = 'UPDATE_USERNAME';
const UPDATE_PASS_PHRASE = 'UPDATE_PASS_PHRASE';
const UPDATE_SEED = 'UPDATE_SEED';

/* ~=~=~=~=~=~=~=~=~=~=~=~= Actions ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
export const openAddAddressModal = actionCreator(OPEN_ADD_ADDRESS_MODAL);
export const closeAddAddressModal = actionCreator(CLOSE_ADD_ADDRESS_MODAL);
export const setActiveTab = actionCreator(SET_ACTIVE_ADD_ADDRESS_TAB, 'activeTab');
export const setIsLoading = actionCreator(SET_IS_LOADING, 'isLoading');
export const clearState = actionCreator(CLEAR_STATE);
export const updatePrivateKey = actionCreator(UPDATE_PRIVATE_KEY, 'privateKey');
export const updatePublicKey = actionCreator(UPDATE_PUBLIC_KEY, 'publicKey');
export const updateUsername = actionCreator(UPDATE_USERNAME, 'username');
export const updatePassPhrase = actionCreator(UPDATE_PASS_PHRASE, 'passPhrase');
export const updateSeed = actionCreator(UPDATE_SEED, 'seed');

/* ~=~=~=~=~=~=~=~=~=~=~=~= Thunks ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
export function importAddress() {
  return async (dispatch, state) => {
    const { FUNDRAISER, SEED_PHRASE, PRIVATE_KEY } = ADD_ADDRESS_TYPES;
    const activeTab = state().addAddress.get('activeTab');
    const seed = state().addAddress.get('seed');
    const username = state().addAddress.get('username');
    const passPhrase = state().addAddress.get('passPhrase');
    const privateKey = state().addAddress.get('privateKey');
    const publicKey = state().addAddress.get('publicKey');
    let body = {};

    switch(activeTab) {
      case PRIVATE_KEY:
        body = { privateKey, publicKey };
        break;
      case SEED_PHRASE:
        body = { seed, passPhrase };
        break;
      case FUNDRAISER:
      default:
        body = { seed, username, passPhrase};
        break;
    }

    try {
      dispatch(setIsLoading(true));
      await postImportAddress(body);
      dispatch(clearState());
      dispatch(setIsLoading(false));
    } catch (e) {
      console.error(e);
      dispatch(setIsLoading(false));
    }
  }
}

/* ~=~=~=~=~=~=~=~=~=~=~=~= Reducer ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
const initState = fromJS({
  activeTab: ADD_ADDRESS_TYPES.FUNDRAISER,
  open: false,
  seed: '',
  username: '',
  passPhrase: '',
  privateKey: '',
  publicKey: '',
  isLoading: false,
});

export default function addAddress(state = initState, action) {
  switch (action.type) {
    case CLEAR_STATE:
      return initState;
    case CLOSE_ADD_ADDRESS_MODAL:
      return state.set('open', false);
    case OPEN_ADD_ADDRESS_MODAL:
      return state.set('open', true);
    case SET_ACTIVE_ADD_ADDRESS_TAB:
      return state.set('activeTab', action.activeTab);
    case UPDATE_PRIVATE_KEY:
      return state.set('privateKey', action.privateKey);
    case UPDATE_PUBLIC_KEY:
      return state.set('publicKey', action.publicKey);
    case UPDATE_SEED:
      return state.set('seed', action.seed);
    case UPDATE_USERNAME:
      return state.set('username', action.username);
    case UPDATE_PASS_PHRASE:
      return state.set('passPhrase', action.passPhrase);
    case SET_IS_LOADING:
      return state.set('isLoading', action.isLoading);
    default:
      return state;
  }
}

/* ~=~=~=~=~=~=~=~=~=~=~=~= Helpers ~=~=~=~=~=~=~=~=~=~=~=~=~=~=~= */
function postImportAddress(body) {
  return request(IMPORT_ADDRESS_URL, 'POST', body);
}
