import UserSignup from "./pages/UserSignup/UserSignup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const apiUrl = process.env.REACT_APP_API_URL;
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
  return (
    <Router>
      <Routes>
        <Route
          path="/signup"
          element={<UserSignup createUser={createUser} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
