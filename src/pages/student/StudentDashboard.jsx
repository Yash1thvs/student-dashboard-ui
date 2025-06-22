import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import Chatbot from "../../components/Chatbot"

import dayjs from "dayjs";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
  ProgressBar,
  Badge,
} from "react-bootstrap";

import { Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


const StudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [message, setMessage] = useState("");
  const [progressInputs, setProgressInputs] = useState({});
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  useEffect(() => {
    fetchAllCourses();
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const res = await axios.get("/student/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnrolledCourses(res.data);
    } catch (err) {
      console.error("Error fetching enrolled courses:", err);
    }
  };

  const fetchAllCourses = async () => {
    try {
      const res = await axios.get("/courses/all");
      setAllCourses(res.data);
    } catch (err) {
      console.error("Error fetching all courses:", err);
    }
  };

  const handleEnroll = async () => {
    if (!selectedCourseId) return;
    try {
      await axios.post(
        `/student/enroll/${selectedCourseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Enrolled successfully!");
      setSelectedCourseId("");
      fetchEnrolledCourses();
    } catch (err) {
      setMessage(err.response?.data?.msg || "❌ Enrollment failed.");
    }
  };

  const handleProgressChange = (courseId, value) => {
    setProgressInputs((prev) => ({
      ...prev,
      [courseId]: value,
    }));
  };

  const handleProgressUpdate = async (courseId) => {
    const newProgress = parseInt(progressInputs[courseId]);
    if (isNaN(newProgress) || newProgress < 0 || newProgress > 100) {
      setMessage("❌ Enter valid progress (0-100)");
      return;
    }

    try {
      await axios.post(
        `/student/courses/${courseId}/progress`,
        { progress: newProgress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Progress updated successfully!");
      fetchEnrolledCourses();
    } catch (err) {
      setMessage(err.response?.data?.msg || "❌ Progress update failed.");
    }
  };

  const enrolledCourseIds = new Set(enrolledCourses.map((c) => c.course_id));
  const availableCourses = allCourses.filter(
    (c) => !enrolledCourseIds.has(c.id)
  );

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
        🎓 My Learning Dashboard
      </h2>

      <Row className="mb-3 align-items-center">
        <Col md={6}>
          <Form.Select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
          >
            <option value="">-- Select a course to enroll --</option>
            {availableCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md="auto">
          <Button variant="primary" onClick={handleEnroll}>
            Enroll
          </Button>
        </Col>
      </Row>

      {message && <Alert variant="info">{message}</Alert>}

      {enrolledCourses.length === 0 ? (
        <p className="text-muted">You haven't enrolled in any courses yet.</p>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {enrolledCourses.map((course) => {
            const isDueSoon =
              dayjs(course.due_date).diff(dayjs(), "day") <= 7;
            return (
              <Col key={course.course_id}>
                <Card className="h-100 d-flex flex-column shadow-sm">
                  <Card.Img
                    variant="top"
                    style={{ height: "180px", objectFit: "cover" }}
                    src={
                      course.thumbnail ||
                      "https://via.placeholder.com/400x200?text=Course+Image"
                    }
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="d-flex justify-content-between align-items-center">
                      {course.name}
                      {course.progress === 100 && (
                        <Badge bg="success">🏆 Completed</Badge>
                      )}
                    </Card.Title>

                    <Card.Text className="mb-1">
                      <strong>Due:</strong> {course.due_date}{" "}
                      {isDueSoon && <span className="text-danger ms-2">⚠️ Due Soon</span>}
                    </Card.Text>

                    <ProgressBar
                      now={course.progress}
                      animated
                      striped
                      label={`${course.progress}%`}
                      className="my-2"
                      variant={course.progress === 100 ? "success" : "primary"}
                    />

                    <div className="mt-auto d-flex gap-2">
                      <Form.Control
                        type="number"
                        min={0}
                        max={100}
                        placeholder="Update %"
                        value={progressInputs[course.course_id] || ""}
                        onChange={(e) =>
                          handleProgressChange(course.course_id, e.target.value)
                        }
                      />
                      <Button
                        variant="info"
                        onClick={() => handleProgressUpdate(course.course_id)}
                      >
                        Update
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
      <Chatbot />
    </Container>
  );
};

export default StudentDashboard;
