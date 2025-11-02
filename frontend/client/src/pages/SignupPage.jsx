import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { roleType } from "../lib/store/userAtom";

const SignupPage = () =>
{
  const [ formData, setFormData ] = useState( {
    name: "",
    email: "",
    password: "",
    id: ""
  } );
  const navigate = useNavigate()
  const [ roleTypeValue ] = useAtom( roleType );

  const handleChange = ( e ) =>
  {
    setFormData( { ...formData, [ e.target.name ]: e.target.value } );
  };

  const handleSubmit = ( e ) =>
  {
    e.preventDefault();

    if ( !formData.name.trim() )
    {
      toast.warning( "Please enter the Name" );
      return;
    }
    if ( !formData.id.trim() )
    {
      toast.warning( "Please enter the ID" );
      return;
    }
    if ( !formData.email.trim() )
    {
      toast.warning( "Please enter the email" );
      return;
    }
    if ( !formData.password.trim() )
    {
      toast.warning( "Please enter the password" );
      return;
    }

    const validEmail = formData.email.split( "@" );
    if ( validEmail[ 1 ] !== "nitc.ac.in" )
    {
      toast.error( "Not a valid Email ID" );
      return;
    }
  }

  const onClickLogin = () =>
  {
    navigate( "/login" )
  }

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={ handleSubmit }>
        <h2>Signup</h2>
        <p>(for { roleTypeValue })</p>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={ formData.name }
          onChange={ handleChange }
          required
        />
        <input
          type="text"
          name="id"
          placeholder="Institute ID"
          value={ formData.id }
          onChange={ handleChange }
          required
        />
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

        <button type="submit">Signup</button>

        <p style={ { marginTop: "1rem", textAlign: "center" } }>
          Already have an account?{ " " }
          <div onClick={ onClickLogin } style={ { color: "blue", textDecoration: "underline", cursor: 'pointer' } }>
            Login
          </div>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
