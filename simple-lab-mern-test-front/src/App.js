import UserSignup from "./pages/UserSignup/UserSignup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UsersList from "./pages/UsersList/UsersList";

function App() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const usersPerPage = parseInt(process.env.REACT_APP_USERS_PER_PAGE) || 5;

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
          element={<UserSignup createUser={createUser} />}
        />
        <Route
          path="/"
          element={
            <UsersList
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
