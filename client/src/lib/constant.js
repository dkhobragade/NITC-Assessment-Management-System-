export const BASEURL = "http://localhost:5001/api/"

export const adminNavbar=[
        { link: '/admin-overview', label: 'Overview'  },
        { link: '/admin-manage-faculty', label: 'Manage Faculty'  },
        { link: '/admin-manage-course', label: 'Manage Course'  },
        { link: '/admin-assign-course', label: 'Assign Course'  },
        { link: '/admin-generate-report', label: 'Generate Report'  },
]

export const facultyNavbar=[
        { link: '/faculty-overview', label: 'Overview'  },
        { link: '/faculty-manage-evalutor', label: 'Manage Evalutor'  },
        { link: '/faculty-manage-student', label: 'Manage Student'  },
        { link: '/faculty-create-task', label: 'Create Task'  },
        { link: '/faculty-map-evalutor', label: 'Map Evalutor'  },
        { link: '/faculty-generate-report', label: 'Generate Report'  },
]

export const evalutorNavbar=[
        { link: '/evaluator-overview', label: 'Overview'  },
        { link: '/evaluator-assigned-student', label: 'Assigned Student'  },
        { link: '/evaluator-generate-report', label: 'Generate Report'  },
]

export const studentNavbar=[
        { link: '/student-overview', label: 'Overview'  },
        { link: '/student-task', label: 'Task'  },
        { link: '/student-result', label: 'Result'  },
]