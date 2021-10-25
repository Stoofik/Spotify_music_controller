import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import {Grid, Button, Typography, TextField, FormHelperText, FormControl, FormControlLabel, Radio, RadioGroup, Collapse} from "@material-ui/core"
import { Link } from 'react-router-dom';
import Alert from "@material-ui/lab/Alert";

// creating the room
const CreateRoomPage = (props) => {

    // setting up state variables 
    const [guestCanPause, setGuestCanPause] = useState(props.guestCanPause);
    const [votesToSkip, setVotesToSkip] = useState(props.votesToSkip);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

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

    // updating the room when button is pressed
    const handleUpdateButtonPressed = () => {
        const requestOptions = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
                code: props.roomCode,
            }),
        };
        // fetching the data an displaying a message
        fetch("/api/update-room/", requestOptions).
            then((response) => {
                if (response.ok) {
                    setSuccessMsg("Room updated Successfuly")
                } else {
                    setErrorMsg("Something went wrong")
            }
            props.updateCallBack();
        });
    }

    // rendering buttons to create a room or get back
    const renderCreateButtons = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={handleRoomButtonPressed}>Create a Room</Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" to="/" component={Link}>Back</Button>
                </Grid>
            </Grid>
        );
    }


    // rending a button to update the room
    const renderUpdateButtons = () => {
        return (
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={handleUpdateButtonPressed}>Update a Room</Button>
            </Grid>
        )
    }


    // setting up variables to distunguish between creating and updating a room
    // if update is true we want to show title update room, else show create a room
    const title = props.update ? "Update a Room" : "Create a Room"

    return (
        
        <Grid container spacing={1} align="center">
            <Grid item xs={12}>
                {/* pop up message to alert the user if they updated the room */}
                {/* if error or succes message exists, show either one */}
                <Collapse in={ errorMsg != "" || successMsg != "" }>
                    { successMsg != "" ? (
                    <Alert severity="success" onClose={()=> {setSuccessMsg("")}}>
                        {successMsg}
                    </Alert>
                    ) : (
                    <Alert severity="error" onClose={()=> {setErrorMsg("")}}>
                        {errorMsg}
                    </Alert>)}
                </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText component="div">
                        <div align="center">
                            Guest Control of Playback State
                        </div>
                    </FormHelperText>
                    <RadioGroup row 
                        defaultValue={props.guestCanPause.toString()}
                        onChange={handleGuestCanPauseChange}>
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
                            defaultValue={votesToSkip} 
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
            {props.update ? renderUpdateButtons() : renderCreateButtons()}
        </Grid>
    );
}

// setting up default settings
CreateRoomPage.defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
    updateCallBack: () => {}
}



export default CreateRoomPage
