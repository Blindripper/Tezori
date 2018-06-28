// @flow
import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import { darken } from 'polished';
import AddCircle from 'material-ui/svg-icons/content/add-circle';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';

import { ms } from '../styles/helpers';
import TezosIcon from './TezosIcon';
import Tooltip from './Tooltip';
import { H3 } from './Heading';
import Button from './Button';
import TezosAmount from './TezosAmount';
import { READY } from '../constants/StatusTypes';

import CreateAccountModal from './CreateAccountModal';

const Container = styled.div`
  overflow: hidden;
`;

const Address = styled.div`
  border-bottom: 1px solid
    ${({ theme: { colors } }) => darken(0.1, colors.white)};
  padding: ${ms(-2)} ${ms(2)};
  cursor: pointer;
  background: ${({ isActive, isReady, theme: { colors } }) => {
    const color = isActive 
      ? colors.accent 
      : colors.white;
  
    return isReady 
      ? color 
      : colors.disabled
  }};
  display: flex;
  flex-direction: column;
`;

const AddressFirstLine = styled.span`
  font-weight: ${({theme: {typo}}) => typo.weights.bold};
  color: ${({ isActive, theme: { colors } }) =>
    isActive ? colors.white : colors.secondary};
`;

const AddressSecondLine = styled.span`
  color: ${({ isActive, theme: { colors } }) =>
    isActive ? colors.white : colors.primary};
  font-weight: ${({theme: {typo}}) => typo.weights.light};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AddressLabel = styled.div`
  padding: ${ms(-1)} ${ms(2)};
  display: flex;
  font-weight: ${({theme: {typo}}) => typo.weights.bold};
  color: ${({ theme: { colors } }) => colors.primary};
  align-items: center;
  justify-content: space-between;
  background: ${({ theme: { colors } }) => colors.gray1};
`;

const AddressLabelIcon = styled(TezosIcon)`
  padding: 0 ${ms(-6)} 0 0;
`;

const HelpIcon = styled(TezosIcon)`
  padding: 0 0 0 ${ms(-4)};
`;

const AddressesTitle = styled.div`
  display: flex;
  align-items: center;
`;

const AccountTitle = styled(H3)`
  font-size: ${ms(1)};
  font-weight: ${({theme: {typo}}) => typo.weights.bold};
  padding: 0 ${ms(-1)} 0 0;
  display: inline-block;
  border-right: 2px solid
    ${({ theme: { colors } }) => darken(0.05, colors.gray1)};
`;

const NoSmartAddressesContainer = styled.div`
  width: 100%;
  padding: ${ms(2)};
  background: ${({ theme: { colors } }) => colors.white};
  text-align: center;
  color: ${({ theme: { colors } }) => colors.secondary};
  font-size: ${ms(-1)};
  position: relative;
`

const NoSmartAddressesTitle = styled.span`
  font-weight: ${({theme: {typo}}) => typo.weights.bold};
`
const NoSmartAddressesDescription = styled.p`
  font-weight: ${({theme: {typo}}) => typo.weights.light};
`

const NoSmartAddressesButton = styled(Button)`
  border: 2px solid ${({ theme: { colors } }) => colors.secondary};
  padding: ${ms(-5)} ${ms(1)};
  font-weight: ${({theme: {typo}}) => typo.weights.bold};
`

const Syncing = styled.div`
  display: ${({ isReady }) =>  isReady ? 'none' : 'flex'};
  align-items: center;
`

const Refresh = styled(RefreshIcon)`
  -webkit-animation:spin 0.5s linear infinite;
  -moz-animation:spin 0.5s linear infinite;
  animation:spin 0.5s linear infinite;
  
  @-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
  @-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
  @keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }
`


type Props = {
  accountBlock: Object, // TODO: type this
  openCreateAccountModal: Function,
  selectAccount: Function,
  selectedAccountHash: string,
  accountIndex: number,
  theme: Object
};

type State = {
  shouldHideSmartAddressesInfo: boolean
};

class AddressBlock extends Component<Props, State> {
  props: Props;
  state = {
    shouldHideSmartAddressesInfo: false
  };

  handleManagerAddressClick = () => {
    const { accountBlock } = this.props;
    const publicKeyHash = accountBlock.get('publicKeyHash');

    this.selectAccount(publicKeyHash, publicKeyHash);
  };

  selectAccount = (accountHash: string, parentHash: string) => {
    this.props.selectAccount(accountHash, parentHash);
  };

  closeNoSmartAddresses = () => {
    this.setState({
      shouldHideSmartAddressesInfo: true
    })
  }

  render() {
    const { accountBlock, selectedAccountHash, accountIndex, openCreateAccountModal, theme } = this.props;
    const publicKeyHash = accountBlock.get('publicKeyHash');
    const { shouldHideSmartAddressesInfo } = this.state
    const isManagerActive = publicKeyHash === selectedAccountHash;
    const smartAddresses = accountBlock.get('accounts')
    const isManagerReady = accountBlock.get('status') === READY;
    //  console.log('-debug: isManagerReady: ', isManagerReady);

    return (
      <Container>
        <AddressLabel>
          <AccountTitle>{`Account ${accountIndex}`}</AccountTitle>
        </AddressLabel>
        <Address
          isActive={isManagerActive}
          isReady={ isManagerReady }
          onClick={this.handleManagerAddressClick}
        >
          <AddressFirstLine isActive={isManagerActive} >
            <AddressesTitle>
              <AddressLabelIcon
                iconName="manager"
                size={ms(0)}
                color={isManagerActive ? 'white' : 'secondary'}
              />
              Manager Address
              <Tooltip position="right" title="lorem ispum dolor">
                <HelpIcon
                  iconName="help"
                  size={ms(0)}
                  color={isManagerActive ? 'white' : 'secondary'}
                />
              </Tooltip>
            </AddressesTitle>
          </AddressFirstLine>
          <AddressSecondLine isActive={isManagerActive}>
            <TezosAmount
              color={
                publicKeyHash === selectedAccountHash ? 'white' : 'primary'
              }
              showTooltip
              amount={accountBlock.get('balance')}
            />
            <Syncing isReady={ isManagerReady } >
              <span>Syncing</span>
              <Refresh
                style={{
                  fill: isManagerActive ? theme.colors.white : theme.colors.primary,
                  height: ms(2),
                  width: ms(2)
                }}
              />
            </Syncing>
          </AddressSecondLine>
        </Address>

        <AddressLabel>
          <AddressesTitle>
            Smart Addresses
            <Tooltip position="right" title="lorem ispum dolor">
              <HelpIcon iconName="help" size={ms(0)} color="secondary" />
            </Tooltip>
          </AddressesTitle>

          <AddCircle
            style={{
              fill: '#7B91C0',
              height: ms(1),
              width: ms(1),
              cursor: !isManagerReady ? 'not-allowed' : 'pointer'
            }}
            onClick={() => {
              if(isManagerReady) {
                openCreateAccountModal();
              }
            }}
          />
        </AddressLabel>
        {smartAddresses && smartAddresses.toArray().length ?
          smartAddresses.map((smartAddress, index) => {
            const isSmartAddressReady = smartAddress.get('status') === READY;
            //  console.log('-debug:  isSmartAddressReady: ', isSmartAddressReady);
            const smartAddressId = smartAddress.get('accountId');
            const isSmartActive = smartAddressId === selectedAccountHash;
            const smartAddressBalance = smartAddress.get('balance');

            return (
              <Address
                key={smartAddressId}
                isActive={isSmartActive}
                isReady={ isSmartAddressReady }
                onClick={() =>
                  this.selectAccount(smartAddressId, publicKeyHash)
                }
              >
                <AddressFirstLine isActive={isSmartActive}>
                  <AddressesTitle>
                    <AddressLabelIcon
                      iconName="smart-address"
                      size={ms(0)}
                      color={isSmartActive ? 'white' : 'secondary'}
                    />
                    {`Smart Address ${index + 1}`}
                  </AddressesTitle>
                </AddressFirstLine>
                <AddressSecondLine isActive={isSmartActive}>
                  <TezosAmount
                    color={isSmartActive ? 'white' : 'primary'}
                    amount={smartAddressBalance}
                  />
                  <Syncing isReady={ isSmartAddressReady } >
                    <span>Syncing</span>
                    <Refresh
                      style={{
                        fill: isSmartActive ? theme.colors.white : theme.colors.primary,
                        height: ms(2),
                        width: ms(2)
                      }}
                    />
                  </Syncing>
                </AddressSecondLine>
              </Address>
            );
          }) : !shouldHideSmartAddressesInfo && (
          <NoSmartAddressesContainer>
            <CloseIcon style={{
              position: 'absolute',
              top: ms(0),
              right: ms(0),
              fill: theme.colors.secondary,
              width: ms(0),
              height: ms(0),
              cursor: 'pointer'
            }} onClick={this.closeNoSmartAddresses} />
            <NoSmartAddressesTitle>
              You don’t have any yet!
            </NoSmartAddressesTitle>
            <NoSmartAddressesDescription>
              Smart Addresses are used for delegation and smart contracts.
            </NoSmartAddressesDescription>
            <NoSmartAddressesButton small buttonTheme="secondary" onClick={openCreateAccountModal}>
              Create New Smart Address
            </NoSmartAddressesButton>
          </NoSmartAddressesContainer>
          )
        }
        <CreateAccountModal />
      </Container>
    );
  }
}

export default withTheme(AddressBlock);
