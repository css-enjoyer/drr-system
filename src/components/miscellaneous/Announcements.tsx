import React, { useEffect, useState } from 'react';
import { Announcement, OpenState } from '../../Types';
import { addAnnouncement, deleteAnnouncement, editAnnouncement, getAnnouncements } from '../../firebase/dbHandler';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { Box, Collapse, Container, Grid, IconButton, Paper, Typography } from '@mui/material';

const Announcements = () => {
    const [announcement, setAnnouncement] = useState<Announcement[]>([]);
    const [open, setOpen] = useState<OpenState>({});

    useEffect(() => {
        const fetchAnnouncements = async() => {
            const announcements = await getAnnouncements();

            console.log("Announcements: ");
            console.log(announcements);

            const transformedResources: Announcement[] = announcements.map((announcement) => ({
                id: announcement.id,
                dateCreation: announcement.dateCreation,
                heading: announcement.heading,
                content: announcement.content
            }));

            // Sort announcements from most recent
            transformedResources.sort((a, b) => b.dateCreation.getTime() - a.dateCreation.getTime()); 
            setAnnouncement(transformedResources);
        };
        
        fetchAnnouncements();
    }, []);

    /* CRUD Functions */
    function addAnnouncement() {
        // ADD: Add functionality
    }

    function deleteAnnouncement() {
        // ADD: Delete functionality
    };

    function editAnnouncement() {
        // ADD: Edit functionality
    };

    /* Helper Functions */
    function handleToggle(index: number) {
        setOpen((prevOpen: OpenState) => ({ 
            ...prevOpen, 
            [index]: !prevOpen[index] 
        }));
    }

    function formatDate(date: Date) {
        const format: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',

            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };

        const formattedDate: string = date.toLocaleDateString("en-US", format);

        return formattedDate;
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6 }}>
            <Container maxWidth="lg">
                <Typography variant="h3" gutterBottom align="center" sx={{ pb: 4, fontSize: '2.7rem' }}>
                    Announcements
                </Typography>
            </Container>
            <Grid container spacing={4}>
                {announcement.map((announcement, index) => (
                <Grid item xs={12} key={index}>
                    <Paper elevation={3} sx={{ p: 3, paddingRight: '48px', position: 'relative' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            { formatDate(announcement.dateCreation) }
                        </Typography>
                        <Typography variant="h4" sx={{ mb: 2 }}>
                            { announcement.heading }
                        </Typography>
                        {/* ADD: BUTTON TO EDIT / DELETE FAQ IF USER IS LIBRARIAN */}
                        <IconButton
                            sx={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1 }}
                            onClick={() => handleToggle(index)}>
                            { open[index] ? <CloseIcon /> : <AddIcon /> }
                        </IconButton>
                        <Collapse in={open[index]}>
                            <Typography variant="body1">
                                { announcement.content }
                            </Typography>
                        </Collapse>
                    </Paper>
                </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Announcements;