// deezerService.ts
import axios from 'axios';

const appId = 'YOUR_APP_ID';
const redirectUri = 'YOUR_REDIRECT_URI';
const appSecret = 'YOUR_APP_SECRET';

export const getDeezerAccessToken = async (code: string) => {
  const tokenUrl = 'https://connect.deezer.com/oauth/access_token.php';

  try {
    const response = await axios.get(tokenUrl, {
      params: {
        app_id: appId,
        secret: appSecret,
        code,
        output: 'json',
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error obtaining Deezer access token:', error);
    throw new Error('Failed to obtain Deezer access token');
  }
};

export const getDeezerAuthUrl = () => {
  return `https://connect.deezer.com/oauth/auth.php?app_id=${appId}&redirect_uri=${redirectUri}&perms=basic_access,email`;
};
