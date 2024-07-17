import UserSignupPage from "./pages/UserSignupPage/UserSignupPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UsersListPage from "./pages/UsersListPage/UsersListPage";
import config from "./config/config";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import Layout from "./components/Layout/Layout";

function App() {
  const { apiUrl, usersPerPage } = config;

  const createUser = async (user) => {
    const response = await fetch(`${apiUrl}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (response.status !== 201) {
      throw new Error("Failed to create user");
    }
  };

  const updateUser = (user) => {
    return fetch(`${apiUrl}/api/users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
  };

  const getUsers = async (options) => {
    const { page, pageSize, filter } = options;
    const response = await fetch(
      `${apiUrl}/api/users?${new URLSearchParams({
        page,
        pageSize,
        ...filter,
      })}`
    );
    if (response.status !== 200) {
      throw new Error("Failed to get users");
    }
    return response.json();
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            path="/signup"
            element={<UserSignupPage createUser={createUser} />}
          />
          <Route
            path="/users"
            element={
              <UsersListPage
                getUsers={getUsers}
                updateUser={updateUser}
                usersPerPage={usersPerPage}
              />
            }
          />
          <Route path="/" element={<h1>Página inicial</h1>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
