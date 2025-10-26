import { useState } from "react";
const LoginPage = () => {
    const [formData, setFormData] = useState({
      email : "",
      password : ""
    })
   const handleSubmit = (e) => {
    e.preventDefault(); 
    alert(`You are logging in with ${formData.email}`);
  };
  return <div>
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Log In</h2>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
           onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  </div>;
};

export default LoginPage;
