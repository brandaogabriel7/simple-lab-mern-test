import UserSignupPage from "./pages/UserSignupPage/UserSignupPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UsersListPage from "./pages/UsersListPage/UsersListPage";
import config from "./config/config";

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

  const updateUser = () => {
    console.log("updateUser");
  };

  const getUsers = async (options) => {
    const { page, pageSize } = options;
    const response = await fetch(
      `${apiUrl}/api/users?${new URLSearchParams({ page, pageSize })}`
    );
    if (response.status !== 200) {
      throw new Error("Failed to get users");
    }
    return response.json();
  };
  return (
    <Router>
      <Routes>
        <Route
          path="/signup"
          element={<UserSignupPage createUser={createUser} />}
        />
        <Route
          path="/"
          element={
            <UsersListPage
              getUsers={getUsers}
              updateUser={updateUser}
              usersPerPage={usersPerPage}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
