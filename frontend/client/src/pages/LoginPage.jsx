import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAtom, useSetAtom } from "jotai";
import { roleType, userAtom } from "../lib/store/userAtom";
import { postWrapper } from "../lib/api/postWrapper";
import { roleConfig } from "../lib/helper/helper";

const LoginPage = () =>
{
  const [ formData, setFormData ] = useState( {
    email: "",
    password: ""
  } );

  const loginAtom = useSetAtom( userAtom )

  const [ roleTypeValue ] = useAtom( roleType )

  const navigate = useNavigate();

  const handleChange = ( e ) =>
  {
    setFormData( { ...formData, [ e.target.name ]: e.target.value } );
  };

  const handleSubmit = ( e ) =>
  {
    const config = roleConfig[ roleTypeValue ];
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

    postWrapper( config.endpoint, {
      email: formData.email,
      password: formData.password
    } ).then( ( resp ) =>
    {
      if ( resp.message )
      {
        loginAtom( {
          name: resp.fullName,
          email: resp.email,
          role: resp.role,
          id: resp.id,
          sID: resp._id
        } )
        toast.success( resp.message )
        navigate( config.redirect )
      }

    } ).catch( ( error ) =>
    {
      toast.error( error.message )

    } ).finally( () =>
    {
      setFormData( {
        email: '',
        password: ''
      } )
    } )


  };

  const onClickSignIn = () =>
  {
    navigate( "/signup" )
  }

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={ handleSubmit }>
        <h2>Log In</h2>
        <p>(for { roleTypeValue })</p>
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
          <div onClick={ onClickSignIn } style={ { color: "blue", textDecoration: "underline", cursor: 'pointer' } }>
            Signup
          </div>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
