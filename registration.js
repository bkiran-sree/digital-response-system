import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../utils/api";
import { ToastContainer, toast } from "react-toastify";
import { Form, Button, Card, Container, Spinner } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Registration.css";

function Registration() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // 🔹 LOGIN FUNCTIONALITY
        if (!formData.email || !formData.password) {
          toast.error("Please fill all fields");
          setLoading(false);
          return;
        }
        const res = await login(formData.email, formData.password);
        toast.success("Login successful!");
        localStorage.setItem("userToken", res.data.token);
        setTimeout(() => navigate("/dashboard"), 1200);
      } else {
        // 🔹 REGISTER FUNCTIONALITY
        if (!formData.name || !formData.email || !formData.password) {
          toast.error("Please fill all fields");
          setLoading(false);
          return;
        }
        await register(formData);
        toast.success("Registration successful!");
        setTimeout(() => setIsLogin(true), 1200);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          (isLogin ? "Login failed" : "Registration failed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <Card style={{ width: "400px", padding: "25px" }}>
        <h3 className="text-center mb-4">
          {isLogin ? "Login" : "Register"}
        </h3>
        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Group>

          <Button
            variant={isLogin ? "primary" : "success"}
            type="submit"
            className="w-100"
            disabled={loading}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : isLogin ? (
              "Login"
            ) : (
              "Register"
            )}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <Button
            variant="link"
            onClick={toggleForm}
            style={{ textDecoration: "none" }}
          >
            {isLogin
              ? "New user? Create an account"
              : "Already registered? Login"}
          </Button>
        </div>
      </Card>

      <ToastContainer position="bottom-right" />
    </Container>
  );
}

export default Registration;
