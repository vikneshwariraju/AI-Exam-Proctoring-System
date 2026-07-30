const FacultyTable = ({ faculty }) => {

  return (
    <div className="card" style={{ padding:20 }}>

      <h3>Faculty</h3>

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

          {faculty.map(user => (

            <tr key={user.id}>

              <td>{user.id}</td>

              <td>{user.name}</td>

              <td>{user.email}</td>

              <td>
  {user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-"}
</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );

};

export default FacultyTable;