import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Card, Alert, Spinner, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboardScreen = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminInfo, setAdminInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentForm, setCurrentForm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAuth();
    fetchForms();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('/api/admin/profile', config);

      if (!data.isAdmin) throw new Error('Not authorized as admin');
      setAdminInfo(data);
    } catch (error) {
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    }
  };

  const fetchForms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('/api/admin/forms', config);
      setForms(data);
    } catch (error) {
      setError(
        error.response?.data?.message || 'Failed to fetch form submissions'
      );
    } finally {
      setLoading(false);
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const viewFormDetails = (form) => {
    setCurrentForm(form);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentForm(null);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedForms = forms
    .filter((form) => {
      const term = searchTerm.toLowerCase();
      return (
        form.name?.toLowerCase().includes(term) ||
        form.email?.toLowerCase().includes(term) ||
        form.phone?.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      const valA = sortField === 'createdAt' ? new Date(a[sortField]) : a[sortField]?.toLowerCase?.() || '';
      const valB = sortField === 'createdAt' ? new Date(b[sortField]) : b[sortField]?.toLowerCase?.() || '';

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const getSortIcon = (field) => {
    if (sortField !== field) return '';
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body className="d-flex justify-content-between align-items-center">
              <h1 className="mb-0">Admin Dashboard</h1>
              <div>
                {adminInfo && (
                  <span className="me-3">
                    Welcome, <strong>{adminInfo.name}</strong>
                  </span>
                )}
                <Button variant="outline-danger" onClick={logoutHandler}>
                  Logout
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>User Form Submissions</Card.Title>

              {error && <Alert variant="danger">{error}</Alert>}

              <div className="mb-3 d-flex justify-content-between align-items-center">
                <Form.Control
                  type="text"
                  placeholder="Search by name, email, or phone"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-50"
                />
                <Button variant="primary" onClick={fetchForms} disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" className="me-1" />
                      Loading...
                    </>
                  ) : (
                    'Refresh Data'
                  )}
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" />
                </div>
              ) : filteredAndSortedForms.length === 0 ? (
                <Alert variant="info">
                  {searchTerm ? 'No matching submissions found.' : 'No form submissions yet.'}
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                          Name{getSortIcon('name')}
                        </th>
                        <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                          Email{getSortIcon('email')}
                        </th>
                        <th onClick={() => handleSort('phone')} style={{ cursor: 'pointer' }}>
                          Phone{getSortIcon('phone')}
                        </th>
                        <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>
                          Date Submitted{getSortIcon('createdAt')}
                        </th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedForms.map((form) => (
                        <tr key={form._id}>
                          <td>{form.name}</td>
                          <td>{form.email}</td>
                          <td>{form.phone}</td>
                          <td>{formatDate(form.createdAt)}</td>
                          <td>
                            <Button variant="info" size="sm" onClick={() => viewFormDetails(form)}>
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Form Submission Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentForm && (
            <Table borderless>
              <tbody>
                <tr><td><strong>Name:</strong></td><td>{currentForm.name}</td></tr>
                <tr><td><strong>Email:</strong></td><td>{currentForm.email}</td></tr>
                <tr><td><strong>Phone:</strong></td><td>{currentForm.phone}</td></tr>
                <tr><td><strong>Address:</strong></td><td>{currentForm.address}</td></tr>
                <tr><td><strong>Message:</strong></td><td>{currentForm.message || 'None'}</td></tr>
                <tr><td><strong>Submitted:</strong></td><td>{formatDate(currentForm.createdAt)}</td></tr>
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboardScreen;
