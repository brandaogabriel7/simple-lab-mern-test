import UserSignupPage from "./pages/UserSignupPage/UserSignupPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UsersListPage from "./pages/UsersListPage/UsersListPage";
import config from "./config/config";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import Layout from "./components/Layout/Layout";
import { createUser, getUsers, updateUser } from "./services/user.service";

function App() {
  const { usersPerPage } = config;
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
