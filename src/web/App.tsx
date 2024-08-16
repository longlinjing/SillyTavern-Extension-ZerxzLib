/* global SillyTavern */

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
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
