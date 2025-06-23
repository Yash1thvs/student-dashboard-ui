import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "../api/axios";

const Chatbot = () => {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("token");

  const fetchHistory = async () => {
    try {
      const response = await axios.get("/chat/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const history = response.data.map((item) => [
        { sender: item.sender, text: item.text }
      ]).flat(); // flatten user-bot pairs
      
      setMessages(history);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  useEffect(() => {
    if (show) fetchHistory();
  }, [show]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const response = await axios.post(
        "/chat",
        { message: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botMsg = { sender: "bot", text: response.data.response };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Something went wrong. Try again." },
      ]);
    }
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setShow(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          borderRadius: "50%",
          padding: "15px",
          fontSize: "24px",
          zIndex: 1050,
        }}
      >
        💬
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>AI Chat Assistant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              marginBottom: "1rem",
              padding: "10px",
              border: "1px solid #dee2e6",
              borderRadius: "8px",
              backgroundColor: "#f8f9fa",
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    padding: "10px 16px",
                    borderRadius: "20px",
                    maxWidth: "70%",
                    backgroundColor:
                      msg.sender === "user" ? "#0d6efd" : "#e9ecef",
                    color: msg.sender === "user" ? "#fff" : "#000",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    wordWrap: "break-word",
                    fontSize: "15px",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <Form.Control
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your question..."
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSend}>
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Chatbot;
