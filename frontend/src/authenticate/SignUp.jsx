import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = { email, password, confirmPassword };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/SignIn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      alert(result.message || result.error);
    } catch (error) {
      alert('Error occurred: ' + error.message);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h1 className="text-center mb-4">Sign Up</h1>
          <form id="signupForm" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="inputEmail" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="inputEmail"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="inputPassword" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="inputPassword"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="inputPasswordConfirm" className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="inputPasswordConfirm"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
