import React, { Component } from 'react'
import { shell } from 'electron'
import styled from 'styled-components'
import Modal from 'react-modal';
import { H2 } from '../Heading'
import Button from '../Button'
import { ms } from '../../styles/helpers'
import theme from '../../styles/theme'

const Container = styled.div`
  background-color: ${ ({ theme: { colors } }) => colors.white };
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled(H2)`
  color: ${({ theme: { colors } }) => colors.primary };
`

const Description = styled.p`
  color: ${({ theme: { colors } }) => colors.primary };
  font-weight: ${({theme: { typo: { weights } } }) => weights.light };
  margin-bottom: ${ms(1)};
`

const Link = styled.span`
  color: ${({ theme: { colors } }) => colors.accent };
  cursor: pointer;
`
const customStyles = {
  content : {
    left: 0,
    width: '100%',
    bottom: 0,
    top: '40%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

type Props = {
  isOpen: boolean,
  agreeTermsAndPolicy: Function,
}


const TermsModal = (props:Props) => {
  const openLink = () => shell.openExternal('https://github.com/Cryptonomic/Tezos-Wallet')
  const { isOpen, agreeTermsAndPolicy } = props
  return (
    <Modal isOpen={isOpen} style={customStyles} ariaHideApp={false}>
      <Container>
        <Title>Hi there!</Title>
        <Description>
          Before we get started, please read our 
          <Link onClick={openLink}> Terms of Service </Link>
          and
          <Link onClick={openLink}> Pivacy Policy </Link>
        </Description>
        <Button
          buttonTheme="primary"
          onClick={agreeTermsAndPolicy}
        >
          I agree
        </Button>
      </Container>
    </Modal>
  )
}

export default TermsModal
