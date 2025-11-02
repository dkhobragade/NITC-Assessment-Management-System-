export const selectedRoleName = (value) =>
  {
    if ( value === "faculty" ) return  "Faculty"
    else if ( value === "evaluator" ) return  "Evaluator"
    else if ( value === "student" ) return  "Student"
    else return  "Admin"
  };

export const adminSidebar = [
  "Overview",
  "Manage Faculty",
  "Manage Course",
  "Generate Report"
];


export const facultySidebar=[
  "Overview",
  "Create Task",
  "Map Evalutor",
  "Generate Report"
]

export const studentSidebar=[
  'Overview',
  "Result",
  "Task"
]