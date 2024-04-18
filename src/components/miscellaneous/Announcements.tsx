import React, { useEffect, useState } from 'react';
import { Announcement } from '../../Types';
import { getAnnouncements } from '../../firebase/dbHandler';
import { Box, Container, Typography } from '@mui/material';

const Announcements = () => {
    const [Announcement, setAnnouncement] = useState<Announcement[]>([]);

    useEffect(() => {
        const fetchAnnouncements = async() => {
            const announcements = await getAnnouncements();

            console.log("Announcements: ");
            console.log(announcements);

            const transformedResources: Announcement[] = announcements.map((announcement) => ({
                dateCreation: announcement.dateCreation,
                heading: announcement.heading,
                content: announcement.content
            }));

            setAnnouncement(transformedResources);
        }
        
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
    
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6 }}>
            <Container maxWidth="lg">
                <Typography variant="h3" gutterBottom align="center" sx={{ pb: 4, fontSize: '2.7rem' }}>
                    Announcements
                </Typography>
            </Container>
        </Box>

        // ADD: FrontEnd & Add/Edit/Delete buttons
    );
};

export default Announcements;