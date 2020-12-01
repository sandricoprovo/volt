import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import updateAppHighlight from '../utils/updateAppHighlight';
import '../styles/settings.css';

const Settings = ({ changeHighlight, config }) => {
  const [highlightColour, setHighlightColor] = useState(config.highlightColor);
  const [saveResponse, setSaveResponse] = useState('');

  // handleColorChange(input) : Takes in the current value of the accent__config input and sets it to state.
  const handleColorChange = (event) => {
    const { value } = event.target;
    setHighlightColor(value);
  };

  // Whenever highlight color changes, this useEffect takes the current color in state and sends it to the updateAppHighlight functions which changes the css root variable that the css files reference their main color from.
  useEffect(() => {
    updateAppHighlight(config.highlightColor);
  }, [config.highlightColor]);

  return (
    <div className="settings__container">
      <form className="settings__form" id="settings__form">
        <h1 className="settings__header">Settings</h1>
        <div className="accent__inputs">
          <label htmlFor="accent-config" className="settings__accent-label">
            Set your Accent Color Here: <br />
            <input
              className="settings__accent"
              name="accent-config"
              type="text"
              placeholder="#ffd318"
              onChange={handleColorChange}
              value={highlightColour}
            />
          </label>
        </div>
        <small className="settings__save-response">{saveResponse}</small>
        <button
          className="settings__save-btn"
          type="submit"
          form="settings__form"
          onClick={(event) => {
            // Updates the state with the success or error response from the changeHighlight function
            setSaveResponse(changeHighlight(event, highlightColour));
            // updateAppHighlight(color string) : sends the color code in state to this so the app's css variable can be updated globally.
            updateAppHighlight(highlightColour);
            // Timeout to removed the status message
            setTimeout(() => {
              setSaveResponse('');
            }, 2000);
          }}
        >
          Update Settings
        </button>
      </form>
      <button
        className="settings__default"
        type="button"
        onClick={(event) => {
          // Updates the state with the success or error response from the changeHighlight function
          setSaveResponse(changeHighlight(event, '#ffd318'));
          // updateAppHighlight(color string) : sends the color code in state to this so the app's css variable can be updated globally.
          updateAppHighlight('#ffd318');
          // Timeout to removed the status message
          setTimeout(() => {
            setSaveResponse('');
          }, 2000);
        }}
      >
        Back to Default
      </button>
    </div>
  );
};

Settings.propTypes = {
  changeHighlight: PropTypes.func,
  config: PropTypes.object,
};

export default Settings;
