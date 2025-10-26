import { useState } from "react";
const LoginPage = () => {
    const [formData, setFormData] = useState({
      email : "",
      password : ""
    })
    const handleSubmit = () =>{
      console.alert("You are loggin")      
    }
  return <div>
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Log In</h2>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  </div>;
};

export default LoginPage;
