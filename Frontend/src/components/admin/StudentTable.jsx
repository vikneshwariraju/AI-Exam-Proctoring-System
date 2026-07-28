const StudentTable = ({ students }) => {

  return (
    <div className="card" style={{ padding:20 }}>

      <h3>Students</h3>

      <table className="table">

        <thead>

          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Joined</th>
          </tr>

        </thead>

        <tbody>

          {students.map(student => (

            <tr key={student.id}>

              <td>{student.id}</td>

              <td>{student.name}</td>

              <td>{student.email}</td>

              <td>{student.created_at}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );

};

export default StudentTable;