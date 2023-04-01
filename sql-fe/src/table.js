import { Table } from "react-bootstrap";

function ResTable(props) {
  const { data } = props;
  const columns = Object.keys(data[0]);
  console.log(data)
  return (

	 <Table striped bordered hover>
      <thead>
        
        <tr>
          {columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
         
       
      </thead>
     <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column}>{row[column]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>



  );
}

export default ResTable;