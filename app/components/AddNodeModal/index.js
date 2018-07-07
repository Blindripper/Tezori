// @flow
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Dialog, TextField, SelectField, MenuItem } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import { ms } from '../../styles/helpers';
import { H2, H4, H3 } from '../Heading/';
import { CONSEIL } from '../../constants/NodesTypes';

import { addNode, setSelected } from '../../reduxContent/nodes/thunks';
import Button from '../Button/';

type Props = {
  setSelected: Function,
  addNode: Function,
  closeAddNodeModal: Function,
  isModalOpen: boolean,
  type: string
};

const StyledCloseIcon = styled(CloseIcon)`
  cursor: pointer;
  height: 20px;
  width: 20px;
  position: absolute;
  top: 10px;
  right: 15px;
`;


const StyledSaveButton = styled(Button)`
  margin-top: ${ms(4)};
  padding-right: ${ms(9)} ;
  padding-left: ${ms(9)} ;
`;

const defaultState = {
  name: '',
  apiKey: '',
  url: ''
};

class AddNodeModal extends Component<Props> {
  props: Props;
  state = defaultState;

  handleNameChange = (_, name) => this.setState({ name });
  handleApiKeyChange = (_, apiKey) => this.setState({ apiKey });
  handleUrlChange = (_, url) => this.setState({ url });
  handleAddNode = () => {
    const { name, apiKey, url } = this.state;
    const { type, closeAddNodeModal, addNode, setSelected } = this.props;
    addNode({ name, apiKey, url, type });
    setSelected(name, type);
    closeAddNodeModal();
    this.setState(defaultState);
  };
  render() {
    const { name, apiKey, url } = this.state;
    const { type, isModalOpen, closeAddNodeModal } = this.props;
    
    const title = type === CONSEIL
      ? 'Conseil'
      : 'Tezos';

    return (
      <Dialog
        modal
        open={isModalOpen}
        bodyStyle={{ padding: '50px 80px' }}
        titleStyle={{ padding: '50px 70px 0px' }}
      >
        <StyledCloseIcon
          style={{ fill: '#7190C6' }}
          onClick={ closeAddNodeModal }
        />
        <H4>Set Up Your Custom { title } Node</H4>

        <TextField
          floatingLabelText="Node Name"
          style={{ width: '100%' }}
          value={ name }
          onChange={this.handleNameChange}
        />

        <TextField
          floatingLabelText="Api Key"
          style={{ width: '100%' }}
          value={ apiKey }
          onChange={this.handleApiKeyChange}
        />

        <TextField
          floatingLabelText="URL (e.g https://127.0.0.1:19731/)"
          style={{ width: '100%' }}
          value={ url }
          onChange={this.handleUrlChange}
        />

        <StyledSaveButton
          buttonTheme="primary"
          onClick={this.handleAddNode}
          disabled={( !name || !url )}
        >
          Save
        </StyledSaveButton>
      </Dialog>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators( { addNode, setSelected }, dispatch );
}

export default connect(null, mapDispatchToProps)(AddNodeModal);
