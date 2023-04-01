import React, { useState } from 'react';
import ResTable from './table';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Toast from 'react-bootstrap/Toast';


function MyTable() {
  const [data, setData] = useState([{"Result": "None"}]);
  const [text, setText] = useState('');
  const [err, setErr] = useState('this');
  const [showA, setShowA] = useState(false);

  const toggleShowA = () => setShowA(!showA);

  const handleSubmit = event => {
    event.preventDefault();
	setShowA(false)
    axios.post('http://backend:5000/v1/api/run', { "query": text })
      .then(response => {
		let rowsAffected = response.data.data.length;

		if (rowsAffected > 0) {
			let message = response.data.data;
			setData(message)
		}

		if (rowsAffected === 0) {
			let message = [{
				"Command Result" : "No rows returned"
			}]
			setData(message)
			setShowA(true)
			setErr("No rows affected.")
		}



	  })
      .catch(error => {
			console.error(error.message)
			let data = error.response.data;
		
			setErr(data.message)
			setShowA(true)
			console.log(err)
		
	  });
  }

  return (
    <Container className="p-3">
		
	<div>
				
      
        <Toast show={showA} onClose={toggleShowA}>
          <Toast.Header>
          
            <strong className="me-auto">Information</strong>
            
          </Toast.Header>
          <Toast.Body>{ err }</Toast.Body>
        </Toast>
   
	</div>
		
	<div>
		<Form onSubmit={handleSubmit} >
			<Form.Group className="mb-3" controlId="formTextArea">
			<Form.Label>Enter Query:</Form.Label>
			<Form.Control as="textarea" rows={3} value={text} onChange={event => setText(event.target.value)} />
			</Form.Group>
     		<Button variant="outline-primary" className="mb-3"  type="submit">Submit</Button>
     	
    	</Form>

	</div>
    
    <ResTable data={data}/>
   
    </Container>
  );
}

export default MyTable;