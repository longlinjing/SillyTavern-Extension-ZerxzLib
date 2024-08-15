/* global SillyTavern */

import React from 'react';

// eslint-disable-next-line no-var
function App() {
    function handleClick() {
        alert(`Hello, ${SillyTavern.getContext().name1}!`);
    }

    return (
        <div onClick={() => handleClick()
        } className="menu_button" >
            Click me
        </div>
    );
}

export default App;
