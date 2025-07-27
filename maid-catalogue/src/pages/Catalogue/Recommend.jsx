import { useEffect, useState } from 'react';
import { Container, Typography, Grid } from '@mui/material';
import MaidCard from '../../components/Catalogue/MaidCard';
import NavBar from '../../components/Catalogue/NavBar';
import { useLocation } from 'react-router-dom';

export default function Recommended() {
  const [recommendedMaids, setRecommendedMaids] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userFavorites, setUserFavorites] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchAllData = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

        // ✅ Only include token for anonymous users (not after login)
    const fetchURL = token
        ? `http://localhost:3000/api/user/recommended/${token}`
        : `http://localhost:3000/api/user/recommended`;

      try {
        // 1️⃣ Fetch recommended maids (works for both signed in and anonymous)
        const recRes = await fetch(fetchURL, {
          credentials: 'include',
        });
        const recData = await recRes.json();
        setRecommendedMaids(recData);

        // 2️⃣ Check if user is logged in
        const authRes = await fetch('http://localhost:3000/api/auth/profile', {
          credentials: 'include',
        });

        if (authRes.ok) {
          setIsAuthenticated(true);

          // 3️⃣ Fetch user favorites if authenticated
          const favRes = await fetch('http://localhost:3000/api/user/GetUserfavorites', {
            credentials: 'include',
          });

          if (favRes.ok) {
            const favData = await favRes.json();
            setUserFavorites(favData); // array of favorite maid IDs
          }
        } else {
          setIsAuthenticated(false); // not logged in
        }
      } catch (err) {
        console.error('Error loading recommended page:', err);
        setIsAuthenticated(false);
      }
    };

    fetchAllData();
  }, [location]);

  return (
    <div>
      <NavBar isAuthenticated={isAuthenticated} />

      <Container sx={{ mt: 10 }}>
        <Typography variant="h4" gutterBottom align="center">
          Recommended Maids
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          {recommendedMaids.length === 0 ? (
            <Typography sx={{ mt: 4 }}>No recommendations found.</Typography>
          ) : (
            recommendedMaids.map((maid) => (
              <Grid item xs={6} sm={6} md={4} key={maid.id}>
                <MaidCard
                  maid={maid}
                  isAuthenticated={isAuthenticated}
                  userFavorites={userFavorites}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </div>
  );
}
