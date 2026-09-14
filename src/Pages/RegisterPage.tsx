import { useState } from "react";
import type { RegisterRequest } from "../Types/registerRequest";
import { registerUser } from "../Services/authService";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const registerData: RegisterRequest = {
      username,
      firstName,
      lastName,
      email,
      password
    };

    try {
      const response = await registerUser(registerData);
      //console.log testausta varten
      console.log(response);
      navigate("/login");
    } catch (error) {
      setError("Username or email is already in use!")
    }




  };

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        {error && (
          <p>{error}</p>
        )}
        <div>
          <label htmlFor="username">Username: </label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="firstName">First name: </label>
          <input
            id="firstName"
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="lastName">Last name: </label>
          <input
            id="lastName"
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email: </label>
          <input
            id="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
