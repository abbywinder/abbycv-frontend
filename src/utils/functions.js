import jwtDecode from 'jwt-decode';
import JSEncrypt from 'jsencrypt';

export const capitalize = string => {
    string = string.toLowerCase()
      if (typeof string === 'string') {
          return string.charAt(0).toUpperCase() + string.slice(1);
      } else {
          return string;
      };
};

export const checkAuth = () => {
  try {
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
      const decodedToken = jwtDecode(authToken);

      if (decodedToken.exp * 1000 < Date.now()) {
        return false;
      }

      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};


export const redirectIfTokenExpired = (test=false) => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) return test ? 'REDIRECTED' : window.location.assign('/login');

    const decodedToken = jwtDecode(authToken);
    const expirationTime = decodedToken.exp * 1000;
  
    const currentTime = Date.now();
    const remainingTime = expirationTime - currentTime;
    
    return remainingTime - 1000 <= 0 ? (test ? 'REDIRECTED' : window.location.assign('/login')) : null;
};

export const encryptPassword = password => {
  const publicKey = localStorage.getItem("encryptionKey");
  if (!publicKey) throw new Error('Error code: 1');

  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);

  const encryptedPassword = encrypt.encrypt(password);
  return encryptedPassword;
};