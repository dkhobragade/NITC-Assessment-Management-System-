import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginPage = () =>
{
  const [ formData, setFormData ] = useState( {
    email: "",
    password: ""
  } );

  const navigate = useNavigate();

  const handleChange = ( e ) =>
  {
    setFormData( { ...formData, [ e.target.name ]: e.target.value } );
  };

  const handleSubmit = ( e ) =>
  {
    e.preventDefault();

    if ( !formData.email.trim() )
    {
      toast.warning( "Please enter your email" );
      return;
    }
    if ( !formData.password.trim() )
    {
      toast.warning( "Please enter your password" );
      return;
    }

    console.log( "Login data:", formData );
  };



  const onClickSignIn = () =>
  {
    navigate( "/login" )
  }

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={ handleSubmit }>
        <h2>Log In</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={ formData.email }
          onChange={ handleChange }
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={ formData.password }
          onChange={ handleChange }
          required
        />
        <button type="submit">Log In</button>
        <p style={ { marginTop: "1rem", textAlign: "center" } }>
          Create an account?{ " " }
          <div onClick={ onClickSignIn } style={ { color: "blue", textDecoration: "underline", } }>
            Signup
          </div>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
