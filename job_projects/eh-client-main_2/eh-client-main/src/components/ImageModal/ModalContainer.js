import React, { Component } from 'react';
import Modal from './ModalWrapper'
import Trigger from './ModalTrigger'

/**This is the entry point for the Modal. It wraps around all the other components and handles the state of when the modal is displayed */
class ModalContainer extends Component {
  state = { isShown: false };
  showModal = () => {
    this.setState({ isShown: true }, () => {
      this.closeButton.focus();
    });
    this.toggleScrollLock();
  };
  closeModal = () => {
    this.setState({ isShown: false });
    this.TriggerButton.focus();
    this.toggleScrollLock();
  };
  onKeyDown = (event) => {
    if (event.keyCode === 27) {
      this.closeModal();
    }
  };
  onClickOutside = (event) => {
    if (this.modal && this.modal.contains(event.target)) return;
    this.closeModal();
  };

  toggleScrollLock = () => {
    document.querySelector('html').classList.toggle('scroll-lock');
  };
  render() {
    return (
      <React.Fragment>
        <Trigger
          showModal={this.showModal}
          buttonRef={(n) => (this.TriggerButton = n)}
          src={this.props.src}
        />
        {this.state.isShown ? (
          <Modal
            modalRef={(n) => (this.modal = n)}
            buttonRef={(n) => (this.closeButton = n)}
            closeModal={this.closeModal}
            onKeyDown={this.onKeyDown}
            onClickOutside={this.onClickOutside}
            src={this.props.src}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default ModalContainer;
