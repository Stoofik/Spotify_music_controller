import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import {Grid, Button, Typography, TextField, FormHelperText, FormControl, FormControlLabel} from "@material-ui/core"
import { Link } from 'react-router-dom';
import Radio from '@material-ui/core/Radio';
import { RadioGroup } from '@material-ui/core';

// default when user does not specify how many votes to skip a song
let defaultVotes = 2;

// creating the room
const CreateRoomPage = () => {

    // setting up state variables 
    const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
    const [guestCanPause, setGuestCanPause] = useState(true);

    // assigning a new value if uses changes votes to skip
    const handleVotesChange = (e) => {
        setVotesToSkip(e.target.value);
    }

    // assigning a new variables when user changes if guest can pause music
    const handleGuestCanPauseChange = (e) => {
        setGuestCanPause(e.target.value === "true" ? true : false);
    }

    // defining a history instance
    let history = useHistory();
    // creating a room when button is pressed
    const handleRoomButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause
            }),
        };
        // fetching the data a redirecting to the newly created room
        fetch("/api/create-room/", requestOptions).
            then((response) => response.json())
            .then((data) => history.push("/room/" + data.code));
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    Create a Room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText component="div">
                        <div align="center">
                            Guest Control of Playback State
                        </div>
                    </FormHelperText>
                    <RadioGroup row defaultValue="true" onChange={handleGuestCanPauseChange}>
                        <FormControlLabel 
                            value="true" 
                            control={<Radio color="primary" />}
                            label="Play/Pause"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel 
                            value="false" 
                            control={<Radio color="secondary" />}
                            label="No Control"
                            labelPlacement="bottom"
                        />
                    </RadioGroup>
                </FormControl>
                <Grid>
                    <Grid item xs={12} align="center">
                        <FormControl>
                            <TextField 
                            requied="true"
                            onChange = {handleVotesChange}
                            type="number" 
                            defaultValue={defaultVotes} 
                            inputProps={{ 
                                min:1,  
                                style: { textAlign: "center" }
                                }}/>
                            <FormHelperText component="div">
                                <div align="center">
                                    Votes Required To Skip Song
                                </div>
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={handleRoomButtonPressed}>Create a Room</Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to="/" component={Link}>Back</Button>
            </Grid>
        </Grid>
    );
}

export default CreateRoomPage
