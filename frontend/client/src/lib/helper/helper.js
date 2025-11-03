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
]

export const roleEndpoints = {
    Admin: "adminAuth/adminSignup",
    Faculty: "facultyAuth/facultySignup",
    Evaluator: "evalutorAuth/evalutorSignup",
    Student: "studentAuth/studentSignup",
};


 export const roleConfig = {
    Admin: {
      endpoint: "adminAuth/adminLogin",
      redirect: "/admindashboard",
      pendingMessage: null,
    },
    Faculty: {
      endpoint: "facultyAuth/facultyLogin",
      redirect: "/facultydashboard",
      pendingMessage: "Your account is not approved by admin yet. Please wait.",
    },
    Evaluator: {
      endpoint: "evalutorAuth/evalutorLogin",
      redirect: "/evaluatordashboard",
      pendingMessage: "Your account is not approved by faculty yet. Please wait.",
    },
    Student: {
      endpoint: "studentAuth/studentLogin",
      redirect: "/studentdashboard",
      pendingMessage: "Your account is not approved by evalutor yet. Please wait.",
    },
  };