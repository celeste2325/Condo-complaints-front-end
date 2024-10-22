import React, {useEffect, useState} from 'react';
import background from '../assets/images/background.jpg'
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {Typography} from '@mui/material';
import {Complaint} from './Complaint'
import {useAuth} from './auth';
import {getPersonByDocument} from '../services/personService'
import {getComplaints} from '../services/complaintService';

const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    margin: '2px',
    marginBottom: '5px'
}));

export function Home() {
    const auth = useAuth();
    const [user, setUser] = useState('')
    const [complaints, setComplaints] = useState([])

    useEffect(() => {
        if (auth.user != null) {
            getComplaintsByTenantOrAdmin();
        }
    }, [auth.user])

    const getComplaintsByTenantOrAdmin = async () => {
        const personByDocument = await getPersonByDocument(auth.user);
        setUser(personByDocument.data.name);

        const tenantDocument = auth.isAdmin ? null : auth.user;
        const complaintsResponse = await getComplaints(tenantDocument);
        setComplaints(complaintsResponse.data);
    }
    return (
        <Box
            sx={{
                width: {lg: '70vw', xs: '80vw', sm: '72vw'},
                height: 'auto',
                margin: 'auto',
                padding: '10px',
                backgroundImage: `url(${background})`,
                boxSizing: 'border-box',
                marginTop: {sm: '10%', xs: '16%', lg: '5%'},
            }}
        >
            <Grid container spacing={2} columns={12}>
                <Grid item xs={12}>
                    <Item>
                        <Typography>
                            {auth.isAdmin ?
                                `Hi ${user}! Welcome! You can easily manage condo complaints, check tenant issues, and update their status here.
`
                                :
                                `Hi ${user}, welcome! Here, you can submit your complaints and track their status.`
                            }
                        </Typography>
                    </Item>
                </Grid>
                <Grid item xs={12}>
                    <Typography
                        variant='h5'
                        textAlign='center'
                        margin='2%'
                        color={'blue'}>
                        {auth.isAdmin ? "Tenant Complaints" : "My Complaints"}
                    </Typography>
                    <Item>
                        {complaints &&
                            <Complaint complaints={complaints}/>
                        }
                    </Item>
                </Grid>
            </Grid>
        </Box>
    );
}
