import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from "react-router-dom";
import {Grid, Button, Typography} from "@material-ui/core";

// display a room
const Room = (props) => {
    // get code parameter
    let params = useParams();
    //set history hook
    let history = useHistory();

    // set info about a room
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(true);
    const [isHost, setIsHost] = useState(false);

    // update default room data by actual data fetched from API
    useEffect(() => {
        fetch("/api/get-room" + "?code=" + params.roomCode)
            .then((response) =>  {
                if (!response.ok) {
                    props.leaveRoomCallback();
                    history.push("/");
                }
                return response.json();
            })
            .then((data) => {
                setVotesToSkip(data.votes_to_skip);
                setGuestCanPause(data.guest_can_pause);
                setIsHost(data.is_host);
        });
    }, []);
    props.leaveRoomCallback();
    const leaveButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        }
        fetch("/api/leave-room/", requestOptions)
        .then((_response) => {
            props.leaveRoomCallback();
            history.push("/");
        });
    }

    return (

        <Grid container spacin={1} align="center">
            <Grid item xs={12}>
                <Typography variant="h6" component="h6">
                    Code: { params.roomCode }
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" component="h6">
                    Votes: { votesToSkip }
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" component="h6">
                    Guest Can Pause: { guestCanPause.toString() }
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" component="h6">
                    Host: { isHost.toString() }
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Button color="secondary" variant="contained" onClick={leaveButtonPressed}>
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    )
}

export default Room
