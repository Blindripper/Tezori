// @flow
import React from 'react';
import styled from 'styled-components';
import { lighten } from 'polished';
import { ms } from '../styles/helpers';
import { H2, H4 } from './Heading';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';

import tezosLogo from '../../resources/tezosLogo.png';

type Props = {
  balance: number,
  publicKeyHash: string,
  onRefreshClick: Function
};

const Container = styled.header`
  padding: ${ms(0)} ${ms(4)};
  background-color: ${({ theme: { colors } }) => colors.accent};
`;

const Row = styled.div`
  margin: 0 0 ${ms(3)} 0;
`;

const TopRow = styled(Row)`
  display: flex;
  justify-content: space-between;
  color: ${({ theme: { colors } }) => lighten(0.3, colors.accent)};
`;

const BottomRow = styled(Row)`
  color: ${({ theme: { colors } }) => colors.white};
`;

const AddressTitle = styled(H4)`
  font-weight: 500;
  color: ${({ theme: { colors } }) => colors.white};
`;

const AddressInfo = styled.div`
  display: flex;
  align-items: center;
`;

const AddressHash = styled(H4)`
  color: ${({ theme: { colors } }) => colors.white};
  margin: 0 ${ms(1)} 0 0;
`;

const AddressTezos = styled.div`
  display: flex;
  align-items: center;
`;

const AddressTezosAmount = styled(H2)`
  color: ${({ theme: { colors } }) => colors.white};
`;

const TezosLogo = styled.img`
  height: ${ms(4)};
  filter: brightness(0%) invert(100%);
`;

export default function BalanceBanner(props: Props) {
  const { balance, publicKeyHash, onRefreshClick } = props;

  return (
    <Container>
      <TopRow>
        Account > Address
        <RefreshIcon
          style={{
            fill: 'white',
            height: ms(2),
            width: ms(2),
            cursor: 'pointer'
          }}
          onClick={onRefreshClick}
        />
      </TopRow>
      <BottomRow>
        <AddressTitle>Address</AddressTitle>
        <AddressInfo>
          <AddressHash>{publicKeyHash}</AddressHash>
          <AddressTezos>
            <AddressTezosAmount>{balance.toFixed(2)}</AddressTezosAmount>
            <TezosLogo alt="tez" src={tezosLogo} />
          </AddressTezos>
        </AddressInfo>
      </BottomRow>
    </Container>
  );
}
