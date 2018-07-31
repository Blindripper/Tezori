import * as status from '../constants/StatusTypes';
import { getTransactions, activateAndUpdateAccount, getSelectedKeyStore, getSelectedHash } from './general';
import { createAccount, getAccountsForIdentity, getSyncAccount } from './account';
import { TRANSACTIONS } from '../constants/TabConstants';
import { FUNDRAISER } from '../constants/StoreTypes';

export function createIdentity(identity) {

  return {
    transactions: [],
    balance: 0,
    accounts: [],
    publicKeyHash: '', 
    publicKey: '',
    privateKey: '',
    operations: {},
    order: null,
    storeTypes: FUNDRAISER,
    activeTab: TRANSACTIONS,
    status: status.CREATED,
    ...identity
  };
}

export function findIdentity(identities, publicKeyHash) {
  return (identities || []).find( identity => identity.publicKeyHash === publicKeyHash );
}

export function findIdentityIndex(identities, publicKeyHash) {
  return (identities || []).findIndex( identity => identity.publicKeyHash === publicKeyHash );
}

export async function getSyncIdentity(identities, identity, nodes) {
  const { publicKeyHash } = identity;
  const keyStore = getSelectedKeyStore( identities, publicKeyHash, publicKeyHash );
  identity = await activateAndUpdateAccount(identity, keyStore, nodes);
  const { selectedAccountHash } = getSelectedHash();
  console.log('-debug: identity', identity);
  /*
   *  we are taking state identity accounts overriding their state
   *  with the new account we got from setAccounts.. check if any of any new accounts
   *  were create and are state identity but dont come back from getAccount and contact
   *  those accounts with the updated accounts we got from getAccounts.
   * */

  let accounts =  await getAccountsForIdentity( nodes, publicKeyHash )
    .catch( (error) => {
      console.log('-debug: Error in: status.getAccountsForIdentity for:' + publicKeyHash);
      console.error(error);
      return [];
    });

  console.log('-debug: accounts', accounts);

  const stateAccountIndices = identity.accounts
    .map( account =>
      account.accountId
    );

  accounts = accounts.map((account) => {
    const foundIndex = stateAccountIndices.indexOf(account.accountId);
    const overrides = {};
    if ( foundIndex > -1 ) {
      overrides.status = identity.accounts[foundIndex].status;
      overrides.operations = identity.accounts[foundIndex].operations;
      overrides.activeTab = identity.accounts[foundIndex].activeTab;
      overrides.order = identity.accounts[foundIndex].order;
    }
    return createAccount({
        ...account,
        ...overrides
      },
      identity
    );
  });

  const accountIndices = accounts
    .map( account =>
      account.accountId
    );

  const accountsToConcat = identity.accounts.filter((account) => {
    return accountIndices.indexOf(account.accountId) === -1;
  });

  accounts = accounts.concat(accountsToConcat);
  
  //  Adding order to accounts without it - in-case of import.
  identity.accounts = accounts.map((account, accountIndex) => {
    account.order = account.order || (accountIndex + 1);
    return account;
  });
  identity.accounts = await Promise.all(
    ( identity.accounts || []).map(async account => {
      if ( account.status !== status.READY ) {
        return await getSyncAccount(
          identities,
          account,
          nodes,
          account.accountId,
          publicKeyHash
        ).catch( e => {
          console.log('-debug: Error in: getSyncIdentity for:' + identity.publicKeyHash);
          console.error(e);
          return account;
        });

      } else if ( selectedAccountHash === account.accountId ) {
        account.transactions = await getTransactions(selectedAccountHash, nodes)
          .catch( e => {
            console.log('-debug: Error in: else -> getSyncIdentity -> getTransactions for:' + selectedAccountHash);
            console.error(e);
            return account.transactions;
          });
      }
      return account;
    })
  );
  
  if ( publicKeyHash === selectedAccountHash) {
    identity.transactions = await getTransactions(publicKeyHash, nodes)
      .catch( e => {
        console.log('-debug: Error in: getSyncIdentity -> getTransactions for:' + publicKeyHash);
        console.error(e);
        return identity.transactions;
      });
  }

  return identity;
}