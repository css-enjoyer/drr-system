import React, { useEffect, useState } from 'react';
import { Announcement, OpenState } from '../../Types';
import { addAnnouncement, deleteAnnouncement, editAnnouncement, getAnnouncements } from '../../firebase/dbHandler';
import { Add as AddIcon, Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Box, Button, Collapse, Container, Grid, IconButton, Paper, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { AuthContext } from '../../utils/AuthContext';

const Announcements = () => {
    const authContext = React.useContext(AuthContext);

    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [open, setOpen] = useState<OpenState>({});

    const [editAnnouncementId, setEditAnnouncementId] = useState<number | null>(null);
    const [editedHeading, setEditedHeading] = useState<string>('');
    const [editedContent, setEditedContent] = useState<string>('');

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newHeading, setNewHeading] = useState('');
    const [newContent, setNewContent] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const fetchAnnouncements = async() => {
            const announcements = await getAnnouncements();

            // --- VALIDATION --- //
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
            setAnnouncements(transformedResources);
        };
        
        fetchAnnouncements();
    }, []);

    const handleToggle = (index: number) => {
        setOpen((prevOpen: OpenState) => ({ 
            ...prevOpen, 
            [index]: !prevOpen[index] 
        }));
    };

    const addNewAnnouncement = async () => {
        try {
            // Validate edited heading and content
            if (!newHeading.trim() || !newContent.trim()) {
                setErrorMessage("Please enter both heading and content.");
                return;
              }
              const existingHeading = announcements.find(announcement => announcement.heading === newHeading);
              if (existingHeading) {
                return;
              }
              setErrorMessage('');

            // Finds the maximum id number, increment by 1
            const existingAnnouncements = await getAnnouncements();
            const maxId = existingAnnouncements.reduce((max, announcement) => (announcement.id > max ? announcement.id : max), 0);
            // Creates unique id
            const newId = maxId + 1;

            const newAnnouncement: Announcement = {
                id: newId,
                dateCreation: new Date(),
                heading: newHeading,
                content: newContent
            };
            await addAnnouncement(newAnnouncement);
            // Fetch updated announcements
            const updatedAnnouncements = await getAnnouncements();
            updatedAnnouncements.sort((a, b) => b.dateCreation.getTime() - a.dateCreation.getTime());
            setAnnouncements(updatedAnnouncements);
            // Reset input fields and error message
            setOpenAddDialog(false);
            setNewHeading('');
            setNewContent('');
            setErrorMessage('');
        } catch (error) {
            console.error("Error adding announcement:", error);
        }
    };

    const editExistingAnnouncement = async () => {
        try {
            // Validate edited heading and content
            if (!editedHeading.trim() || !editedContent.trim()) {
                setErrorMessage("Please enter both heading and content.");
                return;
            }
    
            // Find the existing announcement being edited
            const existingAnnouncement = announcements.find(announcement => announcement.id === editAnnouncementId);
            if (!existingAnnouncement) {
                console.error("Announcement not found for editing:", editAnnouncementId);
                return;
            }
    
            // Create the edited announcement object
            const editedAnnouncement: Announcement = {
                id: editAnnouncementId,
                dateCreation: existingAnnouncement.dateCreation,
                heading: editedHeading,
                content: editedContent
            };
    
            // Call the editAnnouncement function with the edited announcement
            await editAnnouncement(editAnnouncementId, editedAnnouncement);
    
            // Update the announcements state with the edited announcement
            const updatedAnnouncements = announcements.map(announcement =>
                (announcement.id === editAnnouncementId ? editedAnnouncement : announcement)
            );
            setAnnouncements(updatedAnnouncements);
    
            // Reset edit state and error message
            setEditAnnouncementId(null);
            setEditedHeading('');
            setEditedContent('');
            setErrorMessage('');
        } catch (error) {
            console.error("Error editing announcement:", error);
            // Handle error state or show error message to the user
        }
    };
      
    const deleteExistingAnnouncement = async (id: number) => {
        try {
            await deleteAnnouncement(id);
            // Filter out the deleted announcement from the announcements state
            setAnnouncements(prevAnnouncements =>
                prevAnnouncements.filter(announcement => announcement.id !== id)
            );
        } catch (error) {
            console.error('Error deleting announcement:', error);
        }
    };

    const formatDate = (date: Date) => {
        const formatOptions: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
        return date.toLocaleDateString("en-US", formatOptions);
    };

    const handleDialogClose = () => {
        setNewHeading('');
        setNewContent('');
        setErrorMessage('');
      };
    
      const handleCancel = () => {
        setNewHeading('');
        setNewContent('');
        setErrorMessage('');
      };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6 }}>
            <Container maxWidth="lg">
                <Typography variant="h3" gutterBottom align="center" sx={{ pb: 4, fontSize: '2.7rem' }}>
                    Announcements
                </Typography>
                {(authContext?.userRole === "Librarian" || authContext?.userRole === "Admin") && (
                    <Button variant="contained" onClick={() => { setOpenAddDialog(true); handleDialogClose() }} sx={{ mb: 2 }}>
                        Add Announcement
                    </Button>
                )}
                <Grid container spacing={4}>
                    {announcements.map((announcement, index) => (
                        <Grid item xs={12} key={index}>
                            <Paper elevation={3} sx={{ p: 3, paddingRight: '48px', position: 'relative' }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    { formatDate(announcement.dateCreation) }
                                </Typography>
                                <Typography variant="h4" sx={{ mb: 2 }}>
                                    { announcement.heading }
                                </Typography>
                                {(authContext?.userRole === "Librarian" || authContext?.userRole === "Admin") && (
                                    <React.Fragment>
                                        <IconButton
                                            sx={{ position: 'absolute', top: '12px', right: '70px', zIndex: 1 }}
                                            onClick={() => {
                                                setEditAnnouncementId(announcement.id);
                                                setEditedHeading(announcement.heading);
                                                setEditedContent(announcement.content);
                                            }}
                                        >
                                            <EditIcon style={{ fontSize: 20 }} />
                                        </IconButton>
                                        <IconButton
                                            sx={{ position: 'absolute', top: '12px', right: '40px', zIndex: 1 }}
                                            onClick={() => deleteExistingAnnouncement(announcement.id)}
                                        >
                                            <DeleteIcon style={{ fontSize: 20 }} />
                                        </IconButton>
                                    </React.Fragment>
                                )}
                                <IconButton
                                    sx={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1 }}
                                    onClick={() => handleToggle(index)}
                                >
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
            </Container>

            {/* Add Announcement Dialog */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
                <DialogTitle>Add Announcement</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Heading"
                        value={newHeading}
                        onChange={(e) => setNewHeading(e.target.value)}
                        fullWidth
                        margin="normal"
                        error={announcements.some(announcement => announcement.heading === newHeading)}
                        helperText={announcements.some(announcement => announcement.heading === newHeading) ? "An announcement with this heading already exists. Please enter a different one." : ''}
                    />
                    <TextField
                        label="Content"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        fullWidth
                        margin="normal"
                        multiline
                    />
                    {errorMessage && (
                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                            {errorMessage}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenAddDialog(false); handleCancel(); }}>Cancel</Button>
                    <Button onClick={addNewAnnouncement}>Confirm</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Announcement Dialog */}
            <Dialog open={editAnnouncementId !== null} onClose={() => setEditAnnouncementId(null)}>
                <DialogTitle>Edit Announcement</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Heading"
                        value={editedHeading}
                        onChange={(e) => setEditedHeading(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Content"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        fullWidth
                        margin="normal"
                        multiline
                    />
                    {errorMessage && (
                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                            {errorMessage}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditAnnouncementId(null)}>Cancel</Button>
                    <Button onClick={editExistingAnnouncement}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Announcements;