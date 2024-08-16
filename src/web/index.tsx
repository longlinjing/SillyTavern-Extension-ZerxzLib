
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


// Choose the root container for the extension's main UI
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export default () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const rootContainer = document.body;
    const rootElement = document.createElement('div');
    rootContainer.appendChild(rootElement);
    rootElement.id = 'zerxz-lib-root';
    rootElement.setAttribute('style', 'all: initial;position: absolute;bottom: 0;right: 0;z-index: 2147483647;')

    console.log('rootContainer', rootContainer);
    console.log('rootElement', rootElement);
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    );

};
