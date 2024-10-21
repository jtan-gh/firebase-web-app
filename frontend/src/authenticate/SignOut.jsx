import React from 'react';

const SignOut = () => {
  const handleSignOut = async () => {
    try {
      const response = await fetch("`${apiUrl}/api/SignOut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        console.log("User signed out successfully");
        window.location.href = "/";
      } else {
        const errorData = await response.json();
        console.error("Failed to sign out:", errorData);
      }
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <div>
      <h1>Sign Out</h1>
      <button id="signoutButton" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
};

export default SignOut;
