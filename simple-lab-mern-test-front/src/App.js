import UserSignup from "./pages/UserSignup/UserSignup";

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
  return <UserSignup createUser={createUser} />;
}

export default App;
