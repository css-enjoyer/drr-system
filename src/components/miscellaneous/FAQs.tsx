import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, IconButton, Collapse, Grid, Box } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { FAQ } from '../../Types';
import { getFAQs } from '../../firebase/dbHandler';

function FAQs() {
  type OpenState = { [key: number]: boolean };

  const [open, setOpen] = useState<OpenState>({});
  const [FAQs, setFAQs] = useState<FAQ[]>([]);

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
        question: faq.question,
        answer: faq.answer
      }));

      setFAQs(transformedResources);
    }

    fetchFAQs();
  }, []);

  // const faqs = [
  //   {
  //     question: 'How do I contact support?',
  //     answer: 'You can contact support at Tel/Fax: +63 2-8731-3034 | +63 2-8740-9709 | Email: library@ust.edu.ph',
  //   },
  //   {
  //     question: 'How far in advance can I book a discussion room?',
  //     answer: 'You can book a discussion room up to one (1) day in advance.',
  //   },
  //   {
  //     question: 'What is the maximum duration for a discussion room reservation?',
  //     answer: 'Each reservation can be made for a maximum duration of two (2) hours per day per group.',
  //   },
  //   {
  //     question: 'Can I modify my discussion room reservation?',
  //     answer: 'No, you may not modify your discussion room reservation, however you may cancel your existing reservation',
  //   },
  //   {
  //     question: 'Are there any restrictions on the number of people allowed in a discussion room?',
  //     answer: 'Discussion rooms have varying capacities, and reservations must adhere to these limits. Please ensure your group size matches the capacity of the room you reserve.',
  //   },
  //   {
  //     question: 'Am I allowed to bring food and drinks into the discussion rooms?',
  //     answer: 'Food and drinks are generally not permitted in the discussion rooms to maintain cleanliness and prevent damage to the facilities.',
  //   },
  //   {
  //     question: 'What should I do if I encounter issues with my discussion room reservation?',
  //     answer: 'If you encounter any problems with your reservation or the discussion room itself, please contact the library\'s front desk or our website\'s support team for assistance.',
  //   },
  // ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom align="center" sx={{ pb: 4, fontSize: '2.7rem' }}>
            Frequently Asked Questions
        </Typography>
        <Grid container spacing={4}>
          {FAQs.map((faq, index) => (
            <Grid item xs={12} key={index}>
              <Paper elevation={3} sx={{ p: 3, paddingRight: '48px', position: 'relative' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    {faq.question}
                </Typography>
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
    </Box>
  );
}

export default FAQs;
