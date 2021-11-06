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


const branchOptions = [
  { label: 'RC Verso Terzi e Prestatori d\'Opera', value: '0' },
  { label: 'RC del Prodotto', value: '1' },
  { label: 'Sperimentazione Clinica', value: '2' },
  { label: 'Aviation', value: '3' },
  { label: 'Eventi Metereologici Catastrofali e Non', value: '4' },
  { label: 'Cancellazione Eventi', value: '5' },
  { label: 'Over Redemption', value: '6' },
  { label: 'Prize Indemnity', value: '7' },
  { label: 'RCT/O', value: '8' },
  { label: 'RC Patrimoniale', value: '9' },
  { label: 'Colpa Grave Dirigenti e Dipendenti di Enti Pubblici', value: '10' },
  { label: 'Colpa Grave Dirigenti e Dipendenti del Servizio Sanitario Nazionale', value: '11' },
  { label: 'Trattative Private', value: '12' },
  { label: 'Partecipazione a Gare', value: '13' },
  { label: 'Trasporti', value: '14' },
  { label: 'Project Cargo', value: '15' },
  { label: 'Private Collectors', value: '16' },
  { label: 'SicurArredo', value: '17' },
  { label: 'I Grandi Vini', value: '18' }
]
export const bindRamo = (ramo: Number) => {
  for (const item of branchOptions) {
    if (Number(ramo) === Number(item.value))
      return item.label;
  }
}