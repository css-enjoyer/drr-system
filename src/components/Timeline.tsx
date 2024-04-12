import { Container, Typography } from "@mui/material";
import CustomTimelineRenderer from "./CustomTimelineRenderer";
import { useParams } from "react-router-dom";
import { getBranches } from '../firebase/dbHandler';
import { AuthContext } from '../utils/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Branch } from '../Types';
import { auth } from "../firebase/config";
import { formatGreeting } from "../utils/formatGreeting";

function Timeline() {
  const { branchId } = useParams<{ branchId: string }>();
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState<Branch | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchesData = await getBranches();
        const selectedBranch = branchesData.find(branch => branch.branchId === branchId);
        setBranch(selectedBranch);
      } catch (error) {
        console.error('Error fetching branches:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [branchId]);

  return (

    <Container maxWidth="xl" sx={{ pb: 4 }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          width: '100vw',
          height: '100vh',
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url(${branchId === "genref" ? "/src/styles/images/genref3.jpeg" :
              branchId === "scitech" ? "/src/styles/images/scitech4.jpeg" :"/src/styles/images/shs2.jpeg"})`,
          backgroundPosition:
            branchId === "scitech" ? '0% 75%' :
            branchId === "genref" ? '0% 150%' :
            '0% 130%',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          zIndex: -1,
          
        }} />

        {/* container for the texts in the image */}
        <Container sx={{ paddingTop: '30px' }}>

          <Typography variant="h2" sx={{
            mb: "-5px",
            mt: "-15px",
            fontWeight: "800",
            paddingBlockStart: "20px",
            textAlign: "center",
            textShadow: '5px 5px 4px rgba(0, 0, 0, 0.3)',
            fontSize: ['32px', '48px', '64px'],
            color: 'white',
          }}>
            {branch?.branchLoc}
          </Typography>
          <Typography variant="h5" sx={{
            mb: "10px",
            fontWeight: "400",
            textAlign: "center",
            fontSize: ['16px', '20px', '24px'],
            color: 'white',
          }}>
            {branchId === "genref" ? "General References Section" :
              branchId === "scitech" ? "Science and Technology Section" :
                "Senior High School Library Section"}
          </Typography>
          <Typography variant="subtitle1" sx={{
            mt: "30px",
            fontWeight: "300",
            textAlign: "center",
            fontSize: ['14px', '16px', '18px'],
            color: 'white',
          }}>
            Welcome, <strong>{formatGreeting(authContext)}</strong>! | {' '}
            {authContext?.userRole === 'Librarian' ? 'Librarian' :
              authContext?.userRole === 'SHS-Student' || authContext?.userRole === 'Student' ? 'Student' :
                authContext?.userRole === 'Admin' ? 'Admin' : 'Admin'}
          </Typography>
          <Typography variant="subtitle1" sx={{
            mb: "10px",
            fontWeight: "300",
            paddingBlockStart: "10px",
            paddingBlockEnd: "10px",
            textAlign: "center",
            fontSize: ['12px', '14px', '16px'],
            color: 'white',
            lineHeight: 1,
          }}>
            {authContext?.userRole === 'Librarian' ? 'You are now granted permission to oversee the management of rooms. You may undertake actions such as editing, deleting, marking as unavailable, or confirming the arrival/departure of guests.' :
              authContext?.userRole === 'SHS-Student' || authContext?.userRole === 'Student' ? 'You can reserve a discussion room or cancel a reservation.' :
                authContext?.userRole === 'Admin' ? 'You are now granted permission to oversee the management of rooms. You may undertake actions such as editing, deleting, marking as unavailable, or confirming the arrival/departure of guests.' : ''}
          </Typography>
        </Container>
      </div>

      <CustomTimelineRenderer branchId={branchId || ""} />
    </Container>

  );
}

export default Timeline;
