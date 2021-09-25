import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { Link } from 'react-router-dom';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { RadioGroup } from '@material-ui/core';

let defaultVotes = 2;

const CreateRoomPage = () => {

    const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
    const [guestCanPause, setGuestCanPause] = useState(true);

    const handleVotesChange = (e) => {
        setVotesToSkip(e.target.value);
    }

    const handleGuestCanPauseChange = (e) => {
        setGuestCanPause(e.target.value === "true" ? true : false);
    }

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
        fetch("/api/create-room/", requestOptions).
            then((response) => response.json())
            .then((data) => console.log(data));
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

CreateRoomPage.defaultProps = {
    guestCanPause: true,
    votesToSkip: defaultVotes,
}

CreateRoomPage.propTypes = {
    guestCanPause: PropTypes.bool,
    votesToSkip: PropTypes.number.isRequired,
}

export default CreateRoomPage
