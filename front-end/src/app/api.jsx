import axios from 'axios';

const api = axios.create({
  URL: 'http://localhost:8000/api/',
});

export const sendGameUpdate = async (gameState) => {
  try {
    const response = await api.post('game-update/', gameState);
    return response.data;
  } catch (error) {
    console.error('Error sending game update:', error);
  }
};

export const fetchGameState = async () => {
  try {
    const response = await api.get('game-state/');
    return response.data;
  } catch (error) {
    console.error('Error fetching game state:', error);
  }
};