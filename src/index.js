import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import './styles/normalize.css';
import './styles/theme.css';

const root = document.createElement('div');

root.id = 'root';
document.body.appendChild(root);

// Render the application into the root element create above
render(<App />, document.getElementById('root'));
