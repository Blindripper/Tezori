// @flow
import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import AddCircle from 'material-ui/svg-icons/content/add-circle';
import styled, { withTheme } from 'styled-components';
import { ms } from '../styles/helpers';

import { H4 } from './Heading';
import AddressBlock from './AddressBlock';
import Tooltip from './Tooltip';
import {
  openAddAddressModal,
  selectAccount
} from '../reducers/address.duck';
import { openCreateAccountModal } from '../reducers/createAccount.duck';

type OperationGroup = {
  hash: string,
  branch: string,
  kind: string,
  block: string,
  level: number,
  slots: number,
  signature: string,
  proposals: string,
  period: number,
  source: string,
  proposal: string,
  ballot: string,
  chain: string,
  counter: number,
  fee: number,
  blockId: string
};

type Account = {
  accountId: string,
  blockId: string,
  manager: string,
  spendable: boolean,
  delegateSetable: boolean,
  delegateValue: string,
  counter: number,
  script: string,
  balance: number
};

type Identity = {
  privateKey: string,
  publicKey: string,
  publicKeyHash: string,
  balance: number,
  accounts: List<Account>
};

type Props = {
  openCreateAccountModal: Function,
  openAddAddressModal: Function,
  identities: List<Identity>,
  selectAccount: Function,
  selectedAccountHash: string,
  theme: Object
};

const Container = styled.aside`
  width: 30%;
  flex-shrink: 0;
  padding: 0 ${ms(3)} 0 0;
`;

const AccountTitle = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme: { colors } }) => colors.secondary};
  margin: 0 0 ${ms(2)} 0;
`;

const AccountItem = styled.div`
  margin: 0 0 ${ms(1)} 0;
`;

class Addresses extends Component<Props> {
  props: Props;

  render() {
    const { identities, openAddAddressModal, theme: { colors } } = this.props;

    return (
      <Container>
        <AccountTitle>
          <H4>Accounts</H4>
          <Tooltip position="bottom" title="Support for multiple accounts is coming soon.">
            <AddCircle
              disabled={true}
              style={{ fill: colors.secondary, width: ms(3), height: ms(3) }}
            />
          </Tooltip>
        </AccountTitle>
        {identities.map((accountBlock, index) => (
          <AccountItem key={ accountBlock.get('publicKeyHash') }>
            <AddressBlock
              accountBlock={accountBlock}
              accountIndex={index + 1}
              openCreateAccountModal={this.props.openCreateAccountModal}
              selectAccount={this.props.selectAccount}
              selectedAccountHash={this.props.selectedAccountHash}
            />
          </AccountItem>
        ))}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  const { address } = state;

  return {
    identities: address.get('identities'),
    selectedAccountHash: address.get('selectedAccountHash')
  };
}

function mapDispatchToProps(dispatch: Function) {
  return bindActionCreators(
    {
      openCreateAccountModal,
      openAddAddressModal,
      selectAccount
    },
    dispatch
  );
}

export default compose(
  withTheme,
  connect(mapStateToProps, mapDispatchToProps)
)(Addresses);
