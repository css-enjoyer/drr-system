import React from 'react';
import { Container, Typography, Paper, Box, Grid, Avatar, ListItem, List, ListItemText } from '@mui/material';
import { Divider } from "@mui/material";


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
        <Typography variant='h3' gutterBottom sx={{ textAlign: 'left', fontSize: '2rem', fontWeight: 'bold', paddingTop: '2rem' }}>
          About
        </Typography>
        <Typography variant="h6" sx={{ textAlign: 'justify', fontWeight: "300" }}>
          The Discussion Room Reservation System (DRRS) was developed to seamlessly link university students with available library discussion rooms. This system provides students with the convenience of reserving a discussion room remotely, eliminating the need for on-site bookings in advance.
          <br /><br />
          At present, DRRS serves students from specific sections: the Miguel De Benavides SciTech and General References Branch, as well as the UST SHS Library. By using their university email addresses, the system determines which branch students are permitted to access.
        </Typography>

        <Box sx={{ mt: 8, mb: 6 }}>
          <Divider variant="middle" sx={{ backgroundColor: "#1E1F20", width: "100%", mx: "auto" }} />
        </Box>

        <Typography variant='h3' gutterBottom sx={{ textAlign: 'right', fontSize: '2rem', fontWeight: 'bold', paddingTop: '2rem' }}>
          Vision
        </Typography>
        <Typography variant="h6" sx={{ textAlign: 'justify', textAlignLast: 'right', fontWeight: "300" }}>
          Our vision is to enhance the academic experience at the University's libraries by providing an efficient and accessible Discussion Room Reservation System. We aim to bridge the gap between students and library resources, fostering collaboration and knowledge exchange. Through user-friendly tools and service excellence, we aspire to create a vibrant hub for scholarly activities, supporting the University's commitment to academic excellence and innovation.
        </Typography>

        <Box sx={{ mt: 8, mb: 6 }}>
          <Divider variant="middle" sx={{ backgroundColor: "#1E1F20",  width: "100%", mx: "auto" }} />
        </Box>

        <Typography variant='h3' gutterBottom sx={{ textAlign: 'left', fontSize: '2rem', fontWeight: 'bold', paddingTop: '2rem' }}>
          Mission
        </Typography>
        <Typography variant="h6" sx={{ textAlign: 'justify', fontWeight: "300", }}>
          Inspired by the guiding principles of the UST Miguel de Benavides library, our mission is to facilitate seamless access to discussion rooms, fostering a culture of collaborative learning and intellectual exploration within the university community.
        </Typography>
        <List sx={{ pl: 4, textAlign: 'justify' }}>
          <ListItem sx={{textAlign: 'justify'}}>
            <ListItemText primary="1. Providing students and faculty with convenient and efficient access to discussion rooms, enabling them to engage in productive academic discussions and group work." />
          </ListItem>
          <ListItem sx={{textAlign: 'justify'}}>
            <ListItemText primary="2. Cultivating a passion for reading, research, and scholarly inquiry among students and faculty by offering spaces conducive to intellectual exchange and collaboration." />
          </ListItem>
          <ListItem sx={{textAlign: 'justify'}}>
            <ListItemText primary="3. Facilitating global information exchange and community development by creating opportunities for interdisciplinary collaboration and knowledge sharing within and beyond the university." />
          </ListItem>
          <ListItem sx={{textAlign: 'justify'}}>
            <ListItemText primary="4. Supporting the professional development of our staff members, equipping them with the skills and resources necessary to deliver exceptional service and support to our users." />
          </ListItem>
          <ListItem sx={{textAlign: 'justify'}}>
            <ListItemText primary="5. Preserving and promoting the rich heritage of the university by fostering an environment that values and celebrates intellectual curiosity, diversity of thought, and academic excellence." />
          </ListItem>
        </List>
        <Typography variant="h6" sx={{ textAlign: 'justify', fontWeight: "300" }}>
          Through our mission, we aim to empower the university community to thrive in a dynamic and ever-evolving academic landscape, driving innovation, scholarship, and community engagement.
        </Typography>


      </Container>
    </>
  );
}

export default About;
