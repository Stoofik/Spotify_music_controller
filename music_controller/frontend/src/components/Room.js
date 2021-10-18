import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from "react-router-dom";
import {Grid, Button, Typography} from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage"

// display a room
const Room = (props) => {
    // get code parameter
    let params = useParams();
    //set history hook
    let history = useHistory();

    // set state info about a room
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(true);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

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
    }, [])

    // update the room details when a settings of a room is changed
    const getRoomDetails = useCallback(() => {
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
    }, [])
    
        

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
    
    const renderSettings = () => {
        return(
            <Grid container spacing={1} align="center">
                <Grid item xs={12}>
                    <CreateRoomPage update={true} 
                        votesToSkip={votesToSkip} 
                        guestCanPause={guestCanPause} 
                        roomCode={params.roomCode}
                        updateCallBack={getRoomDetails} />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="secondary" onClick={()=>updateShowSettings(false)}>
                        Close
                    </Button>
                </Grid>
            </Grid>
        )
    }

    const updateShowSettings = (value) => {
        setShowSettings(value);
    }

    const renderSettingsButton = () => {
        return (
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={()=>updateShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        )
    }

    if (showSettings) {
        return renderSettings();
    } else {
        return (
        <Grid container spacing={1} align="center">
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
            {isHost ? renderSettingsButton() : null}
            <Grid item xs={12}>
                <Button color="secondary" variant="contained" onClick={leaveButtonPressed}>
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    )
    }
}

export default Room
