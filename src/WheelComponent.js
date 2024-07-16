import React, { useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import { Button, Container, Box, Typography, List, ListItem, Dialog, DialogTitle, DialogContent, DialogActions, Grid, createTheme, ThemeProvider } from '@mui/material';

const prizes = [
  { option: 'CAPYBARAAAA', probability: 0.01, maxWins: 1 },
  { option: 'Sticker', probability: 0.85, maxWins: 60 },
  { option: 'TAM Premium', probability: 0.13, maxWins: 10 }
];

const colors = ['#688CC8', '#DA5A59', '#3CAF6A'];

const WheelComponent = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);
  const [winCounts, setWinCounts] = useState(prizes.map(() => 0));
  const [spinHistory, setSpinHistory] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSpinClick = () => {
    const availablePrizes = prizes.filter(
      (prize, index) => winCounts[index] < prize.maxWins
    );

    const totalProbability = availablePrizes.reduce(
      (acc, prize) => acc + prize.probability,
      0
    );

    const randomValue = Math.random() * totalProbability;
    let cumulativeProbability = 0;
    let selectedIndex = 0;

    for (let i = 0; i < availablePrizes.length; i++) {
      cumulativeProbability += availablePrizes[i].probability;
      if (randomValue <= cumulativeProbability) {
        selectedIndex = prizes.indexOf(availablePrizes[i]);
        break;
      }
    }

    setPrizeIndex(selectedIndex);
    setMustSpin(true);
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    setWinCounts(prevCounts => {
      const newCounts = [...prevCounts];
      newCounts[prizeIndex]++;
      return newCounts;
    });
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSpinHistory(prevHistory => [
      ...prevHistory,
      { option: prizes[prizeIndex].option, time: currentTime }
    ]);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const theme = createTheme({
    typography: {
      fontFamily: 'Montserrat, sans-serif',
    },
    palette: {
      primary: {
        main: '#1976d2',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
            </Grid>
            <Grid item xs={6} display="flex" flexDirection="column" alignItems="center">
              <Typography variant="h4" gutterBottom>
                TIKERA
              </Typography>
              <Box position="relative" display="flex" justifyContent="center" alignItems="center">
                <Box
                  position="absolute"
                  width={0}
                  height={0}
                  borderStyle="solid"
                  borderWidth="20px 10px 0 10px"
                  borderColor="#ff0000 transparent transparent transparent"
                  zIndex={1}
                />
                <Wheel
                  mustStartSpinning={mustSpin}
                  prizeNumber={prizeIndex}
                  textColors={['#FEF0F0']}
                  data={prizes.map((prize, index) => ({
                    ...prize,
                    style: {
                      backgroundColor: colors[index % colors.length],
                      border: '1px solid #fff',
                      boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                      textAlign: 'center',
                      padding: '10px',
                      color: '#fff',
                    }
                  }))}
                  onStopSpinning={handleStopSpinning}
                  innerRadius={15}
                  outerRadius={150}
                />
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSpinClick}
                sx={{ mt: 3 }}
              >
                Spin
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Congratulations!</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              You won: {prizes[prizeIndex].option}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default WheelComponent;
