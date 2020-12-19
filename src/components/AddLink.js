import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/addModal.css';

const AddLinkModal = ({ isOpen, toggleSelf, saveLink }) => {
  const [saveResponse, setSaveResponse] = useState('');

  // Toggles the class the shows and hides the add link modal
  const showHideClass = isOpen ? 'modal__container' : 'modal__container-closed';

  return (
    <div className={showHideClass}>
      <form className="form__container" action="" method="post">
        <h1 className="modal__header">Add New Link</h1>
        <input
          type="text"
          name="new-link"
          placeholder="https://twitter.com/home"
        />
        <small className="modal__response">
          {saveResponse || 'Paste your link above.'}
        </small>
        <div className="form__btns">
          <button
            className="modal__btn link__save"
            type="submit"
            onClick={(event) => {
              // Taking in a success or error message based on link validation
              const isValidLink = saveLink(
                event,
                document.querySelector('input[name="new-link"]')
              );

              setTimeout(() => {
                setSaveResponse('');
              }, 2000);
              // Setting validation response to state to be shown on page
              setSaveResponse(isValidLink);
            }}
          >
            Save
          </button>
          <button
            className="modal__btn link__cancel"
            type="button"
            onClick={toggleSelf}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Props Validation
AddLinkModal.propTypes = {
  isOpen: PropTypes.bool,
  toggleSelf: PropTypes.func,
  saveLink: PropTypes.func,
};

export default AddLinkModal;
