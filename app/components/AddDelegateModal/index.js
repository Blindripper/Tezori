// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Dialog } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import TezosNumericInput from '../TezosNumericInput/'
import { wrapComponent } from '../../utils/i18n';

import Button from '../Button/';
import Loader from '../Loader/';
import Fees from '../Fees/';
import PasswordInput from '../PasswordInput/';
import InputAddress from '../InputAddress/';

import {
  createNewAccount,
  fetchOriginationAverageFees
} from '../../reduxContent/createDelegate/thunks';

type Props = {
  selectedParentHash: string,
  createNewAccount: () => {},
  fetchOriginationAverageFees: () => {},
  open: boolean,
  onCloseClick: () => {},
  t: () => {}
};

const AmountFeePassContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const AmountSendContainer = styled.div`
  width: 45%;
  position: relative;
`;

const FeeContainer = styled.div`
  width: 45%;
  display: flex;
`;

const PasswordButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 42px;
`;

const DelegateButton = styled(Button)`
  width: 194px;
  height: 50px;
`;

const defaultState = {
  loading: false,
  delegate: '',
  amount: '',
  fee: 100,
  passPhrase: '',
  isShowedPwd: false,
  averageFees: {
    low: 100,
    medium: 200,
    high: 400
  }
};

class AddDelegateModal extends Component<Props> {
  props: Props;
  state = defaultState;

  async componentDidUpdate(prevProps) {
    const { open, fetchOriginationAverageFees } = this.props;
    if (open && open !== prevProps.open) {
      const averageFees = await fetchOriginationAverageFees();
      this.setState({ averageFees, fee: averageFees.low });// eslint-disable-line react/no-did-update-set-state
    }
  }


  changeDelegate = (delegate) => this.setState({ delegate });
  changeAmount = (amount) => this.setState({ amount });
  changeFee = (fee) => this.setState({ fee });
  updatePassPhrase = (passPhrase) => this.setState({ passPhrase });
  setLoading = (loading) =>  this.setState({ loading });

  createAccount = async () => {
    const { createNewAccount, selectedParentHash, onCloseClick } = this.props;
    const { delegate, amount, fee, passPhrase } = this.state;
    this.setLoading(true);
    if (
      await createNewAccount(
        delegate,
        amount,
        Math.floor(fee),
        passPhrase,
        selectedParentHash
      )
    ) {
      this.setState(defaultState);
      onCloseClick();
    } else {
      this.setLoading(false);
    }
  };

  render() {
    const { open, onCloseClick, t } = this.props;
    const { loading, averageFees, delegate, amount, fee, passPhrase, isShowedPwd } = this.state;
    const isDisabled = loading || !delegate || !amount || !passPhrase;

    return (
      <Dialog
        modal
        open={open}
        title="Add a Delegate"
        bodyStyle={{ padding: '5px 80px 50px 80px' }}
        titleStyle={{ padding: '50px 70px 0px' }}
      >
        <CloseIcon
          style={{
            fill: '#7190C6',
            cursor: 'pointer',
            height: '20px',
            width: '20px',
            position: 'absolute',
            top: '10px',
            right: '15px',
          }}
          onClick={onCloseClick}
        />
        <InputAddress labelText={t('general.delegate_address')} addressType="delegate" tooltip changeDelegate={this.changeDelegate} />
        <AmountFeePassContainer>
          <AmountSendContainer>
            <TezosNumericInput decimalSeparator={t('general.decimal_separator')} labelText={t('general.amount')} amount={this.state.amount}  handleAmountChange={this.changeAmount} />
          </AmountSendContainer>
          <FeeContainer>
            <Fees
              style={{ width: '50%' }}
              low={averageFees.low}
              medium={averageFees.medium}
              high={averageFees.high}
              fee={fee}
              onChange={this.changeFee}
            />
          </FeeContainer>
        </AmountFeePassContainer>

        <PasswordInput
          label='Wallet Password'
          isShowed={isShowedPwd}
          changFunc={this.updatePassPhrase}
          onShow={()=> this.setState({isShowedPwd: !isShowedPwd})}
        />

        <PasswordButtonContainer>
          <DelegateButton
            buttonTheme="primary"
            disabled={isDisabled}
            onClick={this.createAccount}
          >
            Delegate
          </DelegateButton>
        </PasswordButtonContainer>
        {loading && <Loader />}
      </Dialog>
    );
  }
}

function mapStateToProps({ wallet }) {
  return {
    isLoading: wallet.get('isLoading')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchOriginationAverageFees,
      createNewAccount
    },
    dispatch
  );
}

export default compose(
  wrapComponent,
  connect(mapStateToProps, mapDispatchToProps)
)(AddDelegateModal);
