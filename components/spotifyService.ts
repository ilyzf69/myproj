import axios from 'axios';

const clientId = '6636b68460e641898198ef0b72b2cf17';
const clientSecret = '3081dc3550974321b73d49ea9eca9f82';

const getSpotifyAccessToken = async () => {
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await axios.post(tokenUrl, null, {
      params: {
        grant_type: 'client_credentials',
      },
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error obtaining Spotify access token:', error);
    throw new Error('Failed to obtain Spotify access token');
  }
};

export default getSpotifyAccessToken;
