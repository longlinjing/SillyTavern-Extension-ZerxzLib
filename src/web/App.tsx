/* global SillyTavern */
import * as React from 'react';
import Button from '@mui/material/Button';
import {Fab} from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Box from '@mui/material/Box';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';

const actions = [
    { icon: <FileCopyIcon />, name: 'Copy' },
    { icon: <SaveIcon />, name: 'Save' },
    { icon: <PrintIcon />, name: 'Print' },
    { icon: <ShareIcon />, name: 'Share' },
];
// eslint-disable-next-line no-var
function App() {
    function handleClick() {
        alert(`Hello, ${SillyTavern.getContext().name1}!`);
    }
    const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


    return (
        <ScopedCssBaseline style={{
            display: 'block',
        }} >

            <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 ,display:"block"}}>
                <SpeedDial
                    ariaLabel="SpeedDial basic example"
                    sx={{ position: 'fixed', bottom: 16, right: 16,zIndex: 2147483647 ,display: 'flex', flexDirection: 'column-reverse', alignItems: 'flex-end' }}
                    icon={<SpeedDialIcon />}
                >
                    {actions.map((action) => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            onClick={handleClickOpen}
                        />
                    ))}
                </SpeedDial>
            </Box>
      <Dialog

        open={open}
        onClose={handleClose}
        keepMounted
        sx={{display: 'block',zIndex: 2147483647,position:'absolute'}}
      >
        <DialogTitle>{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose}>Agree</Button>
        </DialogActions>
      </Dialog>
    </ScopedCssBaseline>

    );
}

export default App;
