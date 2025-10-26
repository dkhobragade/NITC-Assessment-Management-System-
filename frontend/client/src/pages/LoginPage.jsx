  const LoginPage = () => {
  return <div>
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Log In</h2>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  </div>;
};

export default LoginPage;
