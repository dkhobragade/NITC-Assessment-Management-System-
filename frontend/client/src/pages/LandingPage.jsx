import { useAtom, useSetAtom } from "jotai";
import { roleType } from "../lib/store/userAtom";
import { useNavigate } from "react-router-dom";

const landingPage = () =>
{

  const setRoleType = useSetAtom( roleType )
  const [ useRole ] = useAtom( roleType )
  const navigate = useNavigate()

  const onClickRole = ( role ) =>
  {
    if ( role == "admin" )
    {
      setRoleType( 0 )
    }
    else if ( role == "faculty" )
    {
      setRoleType( 1 )
    }
    else if ( role == "evaluator" )
    {
      setRoleType( 2 )
    }
    else if ( role == "student" )
    {
      setRoleType( 3 )
    }
    navigate( "/signup" )
  }

  console.log( "roleType", useRole )

  return (
    <div className="landing-container">
      <div className="box" onClick={ () => onClickRole( "admin" ) }>Admin</div>
      <div className="box" onClick={ () => onClickRole( "faculty" ) }>Faculty</div>
      <div className="box" onClick={ () => onClickRole( "evaluator" ) }>Evaluator</div>
      <div className="box" onClick={ () => onClickRole( "student" ) }>Student</div>
    </div>
  );
};

export default landingPage;
