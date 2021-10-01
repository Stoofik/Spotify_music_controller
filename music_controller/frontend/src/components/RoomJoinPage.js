import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

const RoomJoinPage = () => {

    const [ roomCode, setRoomCode ] = useState("");
    const [ error, setError ] = useState("");

    const handleTextFieldChange = (e) => {
        setRoomCode(e.target.value);
    }

    const roomButtonPressed = (e) => {
        console.log(roomCode)
    }


    return (
        <Grid container spacing={1} align="center">
            <Grid item xs={12}>
                <Typography variant="h4" component="h4">
                    Join a Room
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    error={ error.length > 0 }
                    label="Code"
                    placeholder="Enter a Room Code"
                    value={ roomCode }
                    helperText={ error }
                    variant="outlined"
                    onChange={ handleTextFieldChange }
                    />
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={ roomButtonPressed }>Enter Room</Button>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="secondary" to="/" component={Link}>Back</Button>
            </Grid>
        </Grid>
    )
}



RoomJoinPage.propTypes = {
    error: PropTypes.string,
}

RoomJoinPage.defaultProps = {
    error: "",
}

export default RoomJoinPage
