/* global SillyTavern */

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

// eslint-disable-next-line no-var
function App() {
    function handleClick() {
        alert(`Hello, ${SillyTavern.getContext().name1}!`);
    }

    return (
        <Stack>
            <Button className="menu_button" onClick={() => handleClick()}>
                Click me
            </Button>
            <Button className="menu_button" onClick={() => handleClick()}>
                Click me
            </Button>
        </Stack>

    );
}

export default App;
