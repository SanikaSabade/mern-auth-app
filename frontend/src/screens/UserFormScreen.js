import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserFormScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        const { data } = await axios.get('/api/users/profile', config);
        setUserInfo(data);
        setEmail(data.email); // Pre-fill email
        setName(data.name || ''); // Optional pre-fill name if available
      } catch (error) {
        console.error('Authentication check failed:', error);
        localStorage.removeItem('userToken');
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess(false);
    setMessage('');

    if (!name || !email || !phone || !address) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem('userToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.post(
        '/api/forms/submit',
        { name, email, phone, address, message },
        config
      );

      setSuccess(true);
      setLoading(false);

      // Clear form
      setName('');
      setPhone('');
      setAddress('');
      setMessage('');
    } catch (error) {
      setLoading(false);
      setError(
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card className="p-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>User Information Form</h2>
                <Button variant="outline-secondary" onClick={logoutHandler}>
                  Logout
                </Button>
              </div>

              {userInfo && (
                <Alert variant="info">
                  Welcome, {userInfo.name}!
                </Alert>
              )}

              {error && <Alert variant="danger">{error}</Alert>}
              {success && (
                <Alert variant="success">
                  Your information has been successfully submitted!
                </Alert>
              )}

              <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={userInfo !== null}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Additional Message (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Any additional information you'd like to share"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Form'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserFormScreen;
