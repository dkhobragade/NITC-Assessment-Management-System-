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
      setRoleType( "Admin" )
    }
    else if ( role == "faculty" )
    {
      setRoleType( "Faculty" )
    }
    else if ( role == "evaluator" )
    {
      setRoleType( "Evaluator" )
    }
    else if ( role == "student" )
    {
      setRoleType( "Student" )
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
