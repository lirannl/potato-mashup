/**
 * 
 * @param {string} company 
 * @returns {Promise<{status: number, ok: boolean, json: () => Promise<{name: string, twitter_username?: string, concepts: string[]}[]>}>} An array of inventors
 */
const retrieveData = async (company) => {
  const { protocol, hostname } = window.location;
  const baseURL = process.env.REACT_APP_API_PORT ? `${protocol}//${hostname}:${process.env.REACT_APP_API_PORT}` : "";
  const url = `${baseURL}/${process.env.REACT_APP_DATA_PATH || "api"}?assignee=${company}`;
  return await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};

export default retrieveData;