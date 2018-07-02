import * as status from '../constants/StatusTypes';
import { getTransactions, activateAndUpdateAccount, getSelectedKeyStore } from './general';
import { createAccount, getAccountsForIdentity, getSyncAccount } from './account';

export function createIdentity(identity) {

  return {
    transactions: [],
    balance: 0,
    accounts: [],
    publicKeyHash: '', 
    publicKey: '',
    privateKey: '',
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

export async function getSyncIdentity(identities, identity, nodes, selectedAccountHash) {
  const { publicKeyHash } = identity;
  const keyStore = getSelectedKeyStore( identities, publicKeyHash, publicKeyHash );
  identity = await activateAndUpdateAccount(identity, keyStore, nodes);

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

  const stateAccountIndices = identity.accounts
    .map( account =>
      account.accountId
    );

  accounts = accounts.map(account => {
    const foundIndex = stateAccountIndices.indexOf(account.accountId);
    const overrides = {};
    if ( foundIndex > -1 ) {
      overrides.status = identity.accounts[foundIndex].status;
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
  identity.accounts = accounts;
  identity.accounts = await Promise.all(
    ( identity.accounts || []).map(async account => {
      if ( account.status !== status.READY ) {
        return await getSyncAccount(
          identities,
          account,
          nodes,
          publicKeyHash,
          selectedAccountHash
        ).catch( e => {
          console.log('-debug: Error in: getSyncIdentity for:' + identity.publicKeyHash);
          console.error(e);
          return account;
        });

      }
      return account;
    })
  );

  if ( publicKeyHash === selectedAccountHash ) {
    identity.transactions = await getTransactions(publicKeyHash, nodes)
      .catch( e => {
        console.log('-debug: Error in: getSyncIdentity -> getTransactions for:' + publicKeyHash);
        console.error(e);
        return identity.transactions;
      });
  }

  return identity;
}