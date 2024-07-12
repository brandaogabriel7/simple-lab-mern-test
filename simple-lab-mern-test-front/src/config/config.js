const config = {
  apiUrl: process.env.REACT_APP_API_URL,
  usersPerPage: parseInt(process.env.REACT_APP_USERS_PER_PAGE) || 50,
};

export default config;
