export const selectedRoleName = (value) =>
  {
    if ( value === "faculty" ) return  "Faculty"
    else if ( value === "evaluator" ) return  "Evaluator"
    else if ( value === "student" ) return  "Student"
    else return  "Admin"
  };