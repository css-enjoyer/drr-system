import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, IconButton, Collapse, Grid, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { FAQ, OpenState } from '../../Types';
import { getFAQs } from '../../firebase/dbHandler';
import { AuthContext } from '../../utils/AuthContext';

function FAQs() {
  const authContext = React.useContext(AuthContext);

  const [open, setOpen] = useState<OpenState>({});
  const [FAQs, setFAQs] = useState<FAQ[]>([]);

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedQuestion, setEditedQuestion] = useState<string>('');
  const [editedAnswer, setEditedAnswer] = useState<string>('');

  const handleToggle = (index: number) => {
    setOpen((prevOpen: OpenState) => ({ 
      ...prevOpen, 
      [index]: !prevOpen[index] 
    }));
  };

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

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditedQuestion(FAQs[index].question);
    setEditedAnswer(FAQs[index].answer);
  };

  const handleSaveEdit = () => {
    // Save edited question and answer
    const updatedFAQs = [...FAQs];
    updatedFAQs[editIndex!].question = editedQuestion;
    updatedFAQs[editIndex!].answer = editedAnswer;
    setFAQs(updatedFAQs);

    // Reset edit mode
    setEditIndex(null);
  };

  const handleDelete = (index: number) => {
    // Implement delete functionality, e.g., confirm deletion and remove the FAQ item
    console.log("Delete FAQ at index:", index);
  };


  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom align="center" sx={{ pb: 4, fontSize: '2.7rem' }}>
            Frequently Asked Questions
        </Typography>
        <Grid container spacing={4}>
          {FAQs.map((faq, index) => (
            <Grid item xs={12} key={index}>
              <Paper elevation={3} sx={{ p: 3, position: 'relative' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    {faq.question}
                </Typography>
                {authContext?.userRole === "Librarian" || authContext?.userRole === "Admin" && ( // Only render for librarian
              <React.Fragment>
                {/* EDIT */}
                <IconButton
                  sx={{ position: 'absolute', top: '12px', right: '70px', zIndex: 1 }}
                  onClick={() => handleEdit(index)}
                >
                  <EditIcon style={{ fontSize: 20 }} />
                </IconButton>
                {/* DELETE */}
                <IconButton
                  sx={{ position: 'absolute', top: '12px', right: '40px', zIndex: 1 }}
                  onClick={() => handleDelete(index)}
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
      <Dialog open={editIndex !== null} onClose={() => setEditIndex(null)}>
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
          <Button onClick={() => setEditIndex(null)}>Cancel</Button>
          <Button onClick={handleSaveEdit}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FAQs;
