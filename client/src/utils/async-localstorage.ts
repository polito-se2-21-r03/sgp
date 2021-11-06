const asyncLocalStorage = {
  setItem: async function (key: string, value: string) {
    await null;
    localStorage.setItem(key, value);
    const res = await this.getItem(key);
    if (res !== null)
      return true;
    else
      return false;
  },
  getItem: async function (key: string) {
    await null;
    return localStorage.getItem(key);
  },
  removeItem: async function (key: string) {
    await null;
    return localStorage.removeItem(key);
  }
};

export default asyncLocalStorage;