
const AdminOverView = () =>
{

    return <div style={ { display: "flex" } }>

        <div style={ { width: "85%", padding: '10px' } }>
            <div style={ { display: 'flex', gap: '10px' } }>
                <div style={ { width: '50%', maxHeight: 'fit-content', border: '1px solid black', borderRadius: '20px' } }>
                    <p style={ { fontSize: '20px', fontWeight: '700' } }>Overview</p>
                    <div style={ { display: 'flex', flexDirection: 'column', justifySelf: 'start', gap: '5px', padding: '5px' } }>
                        <p>1. Active Users</p>
                        <p>2. Task Created </p>
                        <p>3. Total Faculty </p>
                        <p>4. Total Courses </p>
                    </div>
                </div>
                <div style={ { padding: '10px', maxWidth: '50%', maxHeight: 'fit-content', border: '1px solid black', borderRadius: '20px' } }>
                    <p style={ { fontSize: '20px', fontWeight: '700' } }>Quick Actions</p>
                    <div style={ { display: 'flex', flexDirection: 'column', width: '150px', gap: '20px' } }>
                        <button>Add Courses</button>
                        <button>Generate Report</button>
                    </div>
                </div>
            </div>
        </div >
    </div >
}

export default AdminOverView