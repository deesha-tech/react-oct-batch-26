import { useState, type ChangeEvent } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

interface LoginFormData {
    email: string, 
    password: string
}

const INITAL_DATA: LoginFormData = {email: '', password: ''}


function LoginForm() {

   const [data, setData] = useState<LoginFormData>(INITAL_DATA)

    function handleChange(event: ChangeEvent){
        // console.log('name of the element', event.target.name)
        // console.log('value of the eleemnt', event.target.value)
        const {name, value} = event.target; 

        setData( (current)=> {
            return {...current, [name]: value }
        } )
    }


  return (
    <Container>
      <Row>
        <Col>
          <h1>Login Form</h1>

          <Form>
            
            <Form.Group className="mb-3" controlId="loginForm.email">
              <Form.Label>Email address</Form.Label>
              <Form.Control 
                value={data.email}
                onChange={handleChange}
                type="email" 
                name="email"
                placeholder="name@example.com" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="loginForm.password">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                value={data.password}
                onChange={handleChange}
                type="password" 
                name="password"
                placeholder="Enter your passwrod" />
            </Form.Group>

            <Form.Group
              className="mb-3">
              <Button className="btn btn-primary">Login</Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginForm;
