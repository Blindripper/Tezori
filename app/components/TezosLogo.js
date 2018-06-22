// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Button from './Button';
import tezosLogo from '../../resources/tezosLogo.png';
import { goHomeAndClearState } from '../reducers/walletInitialization.duck';
import { ms } from '../styles/helpers'

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: ${ms(0)} 0;
`;

const Logo = styled.img`
  height: 50px;
  width: 50px;
  cursor: pointer;
  margin-left: -10px;
`;

const Text = styled.span`
  font-size: ${ms(2)};
  font-family: ${({ theme }) => theme.typo.fontFamily.primary};
  color: ${({ theme: { colors } }) => colors.primary};
  padding-left: ${ms(2)};
  letter-spacing: 0.9px;
`;

type Props = {
  goHomeAndClearState: Function
};

class TezosLogo extends Component<Props> {
  render() {
    const { goHomeAndClearState } = this.props;
    return (
      <Container>
        <Button
          onClick={goHomeAndClearState}
          buttonTheme="plain"
          children={<Logo src={tezosLogo} />}
          key="logo"
        />
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ goHomeAndClearState }, dispatch);

export default connect(null, mapDispatchToProps)(TezosLogo);
