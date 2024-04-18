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
                {/* ADD: BUTTON TO EDIT / DELETE FAQ IF USER IS LIBRARIAN */}
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
