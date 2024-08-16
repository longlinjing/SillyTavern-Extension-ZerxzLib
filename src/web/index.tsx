
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
    const rootContainer = document.body!;
    const rootElement = document.createElement('div');
    rootElement.id = 'zerxz-lib-root';
    rootElement.style = 'all: initial,position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: black; color: white; padding: 20px; border: 1px solid white; z-index: 10000; display: block; overflow-y: auto; max-height: 80vh;';
    rootContainer.appendChild(rootElement);
    console.log('rootContainer', rootContainer);
    console.log('rootElement', rootElement);
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    );

};
