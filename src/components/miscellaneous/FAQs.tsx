import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, IconButton, Collapse, Grid, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { FAQ, OpenState } from '../../Types';
import { addFAQ, deleteFAQ, editFAQ, getFAQs } from '../../firebase/dbHandler';
import { AuthContext } from '../../utils/AuthContext';

function FAQs() {
  const authContext = React.useContext(AuthContext);

  const [open, setOpen] = useState<OpenState>({});
  const [FAQs, setFAQs] = useState<FAQ[]>([]);

  const [editFAQId, setEditFAQId] = useState<number | null>(null);
  const [editedQuestion, setEditedQuestion] = useState<string>(''); 
  const [editedAnswer, setEditedAnswer] = useState<string>('');

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  useEffect(() => {
    const fetchFAQs = async () => {
      const faqs = await getFAQs();
  
      // --- VALIDATION --- //
      console.log("FAQs");
      console.log(faqs);
  
      const transformedResources: FAQ[] = faqs.map((faq) => ({
        id:  faq.id,
        question: faq.question,
        answer: faq.answer
      }));
  
      transformedResources.sort((a, b) => a.id - b.id);
        setFAQs(transformedResources);
    }
  
    fetchFAQs();
  }, []);

  const handleAdd = async () => {
    try {
      if (!newQuestion.trim() || !newAnswer.trim()) {
        setErrorMessage("Please enter both question and answer.");
        return;
      }

      const existingQuestion = FAQs.find(faq => faq.question === newQuestion);
      if (existingQuestion) {
        return;
      }

      setErrorMessage('');

      const existingFAQs = await getFAQs();
      const maxId = existingFAQs.reduce((max, faq) => (faq.id > max ? faq.id : max), 0);
      const newId = maxId + 1;

      const newFAQ: FAQ = {
        id: newId,
        question: newQuestion,
        answer: newAnswer
      };

      await addFAQ(newFAQ);
      const updatedFAQs = await getFAQs();
      updatedFAQs.sort((a, b) => a.id - b.id);

      setFAQs(updatedFAQs);

      setOpenAddDialog(false);

      setNewQuestion('');
      setNewAnswer('');
      setErrorMessage('');
    } catch (error) {
      console.error("Error adding FAQ:", error);
    }
  };

  const handleEdit = (id: number) => {
    setEditFAQId(id);
    const editedFAQ = FAQs.find(faq => faq.id === id);
    if (editedFAQ) {
      setEditedQuestion(editedFAQ.question);
      setEditedAnswer(editedFAQ.answer);
    }
  };

  const handleSaveEdit = async () => {
    if (editFAQId !== null) {
      const editedFAQ = { id: editFAQId, question: editedQuestion, answer: editedAnswer };
      await editFAQ(editFAQId, editedFAQ);
      const updatedFAQs = FAQs.map(faq => (faq.id === editFAQId ? editedFAQ : faq));
      setFAQs(updatedFAQs);
      setEditFAQId(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      console.log("Deleting FAQ with ID:", id);
      const deletedId = await deleteFAQ(id);
      console.log("Deleted FAQ ID:", deletedId);
      if (deletedId !== "") {
        // Remove the deleted FAQ from the state immediately
        setFAQs(prevFAQs => prevFAQs.filter(faq => faq.id !== id));
      } else {
        console.error("FAQ deletion failed.");
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  };

  function handleToggle(index: number): void {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [index]: !prevOpen[index],
    }));
  }

  const handleDialogClose = () => {
    setNewQuestion('');
    setNewAnswer('');
    setErrorMessage('');
  };

  const handleCancel = () => {
    setNewQuestion('');
    setNewAnswer('');
    setErrorMessage('');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom align="center" sx={{ pb: 4, fontSize: '2.7rem' }}>
            Frequently Asked Questions
        </Typography>
        {(authContext?.userRole === "Librarian" || authContext?.userRole === "Admin") && (
          <React.Fragment>
        {/* Add FAQ button */}
        <Button variant="contained" onClick={() => setOpenAddDialog(true)} sx={{ mb: 2 }}>Add FAQ</Button>
        {/* Add FAQ dialog */}
        <Dialog open={openAddDialog} onClose={() => { setOpenAddDialog(false); handleDialogClose(); }}>
          <DialogTitle>Add FAQ</DialogTitle>
          <DialogContent>
            {/* Input fields for question and answer */}
            <TextField
              label="Question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              fullWidth
              margin="normal"
              error={FAQs.some(faq => faq.question === newQuestion)}
              helperText={FAQs.some(faq => faq.question === newQuestion) ? "This question already exists. Please enter a different one." : ''}
            />
            <TextField
              label="Answer"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
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
            <Button onClick={handleAdd}>Confirm</Button>
          </DialogActions>
        </Dialog>
          </React.Fragment>
        )}
        <Grid container spacing={4}>
          {FAQs.map((faq, index) => (
            <Grid item xs={12} key={index}>
              <Paper elevation={3} sx={{ p: 3, position: 'relative' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    {faq.question}
                </Typography>
                {(authContext?.userRole === "Librarian" || authContext?.userRole === "Admin") && (
                  <React.Fragment>
                    {/* EDIT */}
                    <IconButton
                      sx={{ position: 'absolute', top: '12px', right: '70px', zIndex: 1 }}
                      onClick={() => handleEdit(faq.id)}
                    >
                      <EditIcon style={{ fontSize: 20 }} />
                    </IconButton>
                    {/* DELETE */}
                    <IconButton
                      sx={{ position: 'absolute', top: '12px', right: '40px', zIndex: 1 }}
                      onClick={() => handleDelete(faq.id)}
                    >
                      <DeleteIcon style={{ fontSize: 20 }} />
                    </IconButton>
                  </React.Fragment>
                )}
                <IconButton
                  sx={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1 }}
                  onClick={() => handleToggle(index)}>
                  { open[index] ? <CloseIcon /> : <AddIcon /> }
                </IconButton>

                <Collapse in={open[index]}>
                  <Typography variant="body1">
                      {faq.answer}
                  </Typography>
                </Collapse>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Dialog open={editFAQId !== null} onClose={() => setEditFAQId(null)}>
        <DialogTitle>Edit FAQ</DialogTitle>
        <DialogContent>
          <TextField
            label="Question"
            value={editedQuestion}
            onChange={(e) => setEditedQuestion(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Answer"
            value={editedAnswer}
            onChange={(e) => setEditedAnswer(e.target.value)}
            fullWidth
            margin="normal"
            multiline
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditFAQId(null)}>Cancel</Button>
          <Button onClick={handleSaveEdit}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FAQs;
