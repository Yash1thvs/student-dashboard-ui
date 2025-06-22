import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { Container, Row, Col, Card, Button, Form, Badge, ProgressBar } from "react-bootstrap";

import { Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    thumbnail: "",
    due_date: "",
  });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };


  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/instructor/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/instructor/courses", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Course created successfully!");
      setFormData({ name: "", thumbnail: "", due_date: "" });
      fetchCourses();
    } catch (error) {
      setMessage(error.response?.data?.msg || "Failed to create course.");
    }
  };

  return (
    <Container className="mt-4">
      <Navbar expand="lg" className="mb-4 shadow-sm">
        <Container>
          <Navbar.Brand>📘 EduPlatform</Navbar.Brand>
          <Nav className="ms-auto">
            <Button variant="outline-danger" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <h2 className="text-center mb-4">
        👩‍🏫 Instructor Dashboard
      </h2>

      <Card className="mb-5">
        <Card.Body>
          <h5 className="mb-3">Create New Course</h5>
          {message && <p className="text-success">{message}</p>}
          <Form onSubmit={handleCourseSubmit}>
            <Row className="mb-2">
              <Col md={4}>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Course Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  name="thumbnail"
                  placeholder="Thumbnail URL"
                  value={formData.thumbnail}
                  onChange={handleInputChange}
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col md={1}>
                <Button type="submit" variant="primary" block>
                  Create
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Row>
        {courses.length === 0 ? (
          <p className="text-muted text-center">No courses created yet.</p>
        ) : (
          courses.map((course) => (
            <Col key={course.id} md={4} className="mb-4">
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  src={course.thumbnail}
                  alt={course.name}
                  style={{ objectFit: "cover", height: "180px" }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{course.name}</Card.Title>
                  <Card.Text>
                    <strong>Due:</strong> {course.due_date}
                  </Card.Text>
                  <Card.Text>
                    <strong>Enrolled:</strong> {course.enrollment_count}
                  </Card.Text>
                  <div className="mb-2">
                    <strong>Completion:</strong>
                    <ProgressBar
                      now={course.completion_percentage}
                      label={`${course.completion_percentage}%`}
                      striped
                      variant="success"
                      className="mt-1"
                    />
                  </div>
                  <Card.Subtitle className="mt-3 mb-2 text-muted">
                    Enrolled Students:
                  </Card.Subtitle>
                  {course.enrolled_students.length === 0 ? (
                    <p className="text-muted">No students enrolled yet.</p>
                  ) : (
                    <ul className="ps-3 mb-0" style={{ fontSize: "0.9rem" }}>
                      {course.enrolled_students.map((student) => (
                        <li key={student.id}>
                          {student.name} — {student.progress}%
                        </li>
                      ))}
                    </ul>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default InstructorDashboard;
