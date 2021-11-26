// return the user data from the session storage
export const getUser = () => {
  const userStr = sessionStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  else return null;
}

// return the token from the session storage
export const getToken = () => {
  return sessionStorage.getItem('token') || null;
}

// remove the token and user from the session storage
export const removeUserSession = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
}

// set the token and user from the session storage
export const setUserSession = (token: string, user: any) => {
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('user', JSON.stringify(user));
}

/** 
 * Verify authentication
 */
export const verifyToken = async () => {
  try {
    const data = await fetch(((process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : '/api') + '/auth', {
      method: 'POST',
      credentials: 'include',
    })
    const response = await data.json();
    if (response.status === 'success') {
      return { status: true, data: response.data }
    } else {
      return { status: false, data: null };
    }
  } catch (err) {
    console.log(`⚡️ An error occurred: ${err}`);
    return false;
  }
}

/**
 * Parse date label
 * @param date 
 * @returns 
 */
export const parseDateLabel = (date: Date) => {
  return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + (date.getDate())).slice(-2)}`;
}
