import { useEffect, useState } from 'react';
import { Container, Typography, Grid } from '@mui/material';
import MaidCard from '../components/MaidCard';
import NavBar from '../components/NavBar';

export default function Favorites() {
  const [favoriteMaids, setFavoriteMaids] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthAndFetchFavorites = async () => {
      try {
        // 1️⃣ Check if authenticated
        const res = await fetch('http://54.169.107.1157.115:3000/api/auth/profile', {
          credentials: 'include',
        });

        if (res.ok) {
          setIsAuthenticated(true);

          // 2️⃣ Fetch user's favorite maids
          const favRes = await fetch('http://54.169.107.115/:3000/api/user/favorites', {
            credentials: 'include',
          });
          const data = await favRes.json();
          setFavoriteMaids(data);
          console.log('Favorite maids:', data);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error(err);
        setIsAuthenticated(false);
      }
    };

    checkAuthAndFetchFavorites();
  }, []);

  return (
    <div>
      <NavBar isAuthenticated={isAuthenticated} />

      <Container sx={{ mt: 10 }}>
        <Typography variant="h4" gutterBottom align="center">
          My Favorites
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          {favoriteMaids.length === 0 ? (
            <Typography sx={{ mt: 4 }}>No favorites found. testing</Typography>
          ) : (
            favoriteMaids.map((maid) => (
              <Grid item xs={6} sm={6} md={4} key={maid.id}>
                <MaidCard userFavorites={favoriteMaids.map(m => m.id)} maid={maid} isAuthenticated={isAuthenticated} />
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </div>
  );
}
