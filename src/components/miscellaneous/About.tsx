import React from 'react';
import { Container, Typography, Paper, Box, Grid, Avatar } from '@mui/material';

import headerImg from '/src/styles/images/loginBgImageDark.png';

// Define contact data as an array of objects
const contacts = [
  {
    name: 'Ralph Jersen Alba',
    phone: '(123) 456-7890',
    email: 'ralph@example.com'
  },
  {
    name: 'John Doe',
    phone: '(987) 654-3210',
    email: 'john@example.com'
  },
  {
    name: 'Jane Smith',
    phone: '(555) 555-5555',
    email: 'jane@example.com'
  }
];

// Contact component to render individual contact information
const Contact = ({ name, phone, email }) => (
  <Paper elevation={3} sx={{ padding: '20px', marginBottom: '20px', minWidth: '300px', borderRadius: '10px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
    <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
      {name}
    </Typography>
    <Typography variant="body2" sx={{ marginBottom: '5px', color: '#666' }}>
      Phone: {phone}
    </Typography>
    <Typography variant="body2" sx={{ color: '#666' }}>
      Email: {email}
    </Typography>
  </Paper>
);

function About() {
  return (
    <>
      <Container
        component="header"
        maxWidth="xl"
        sx={{
          backgroundImage: `url(${headerImg})`,
          backgroundSize: '100%',
          backgroundPosition: 'top',
          minHeight: '35vh',
          minWidth: '100vw',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0px, 0px !important',
          margin: '0px'
        }}
      />

      <Container
        sx={{
          textAlign: 'center',
          padding: '20px',
          maxWidth: 'xl2',
          marginBottom: '20px',
        }}
      >
        <Typography variant='h3' gutterBottom sx={{ }}>
          About
        </Typography>

        <Typography variant="h6"  sx={{ textAlign: 'justify' }}>
          Welcome to the Discussion Room Reservation System! This platform is designed to transform the way room bookings are handled at the University of Santo Tomas’ Miguel de Benavides Library and Frassati Senior High School Library. We aim to enhance efficiency, convenience, and accessibility for both students and librarians.
          Central to our initiative is a dedicated website exclusively for discussion room reservations. No more manual processes or cumbersome procedures; our system streamlines the entire reservation process, saving valuable time and effort for librarians while providing students with a user-friendly platform to book rooms effortlessly.
          Previously, both the Miguel de Benavides Library and Frassati Senior High School Library relied on rudimentary systems utilizing online tools like Google Workspace and Microsoft Office. While functional, these tools lacked the sophistication and efficiency required for modern-day room reservations.
          Recognizing this need for improvement, our project was initiated to deliver a solution tailored to the unique requirements of these libraries. By harnessing the power of technology, we've created a streamlined and effective reservation process, enhancing the overall library experience for students and staff alike.
          Welcome to a new era of discussion room reservations. With our system in place, we're building a brighter, more efficient future for library services at the University of Santo Tomas.
        </Typography>

      </Container>
    </>
  );
}

export default About;
