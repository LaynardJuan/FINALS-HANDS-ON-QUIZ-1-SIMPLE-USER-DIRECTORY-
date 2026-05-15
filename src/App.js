import React, { useState, useEffect } from "react";
import "./App.css";

function useFetchUsers(url, limit = 5) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        setUsers(data.slice(0, limit));
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  } , [url, limit]);

  return { users, loading, error };
}

export default function App() {
  const { users, loading, error } = useFetchUsers("https://jsonplaceholder.typicode.com/users", 5);

  return (
    <div className="container">
      <h1>User List</h1>

      {loading && <p className="loading">Loading users...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="list-container">
          {users.map((user) => (
            <div key={user.id} className="card">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Company:</strong> {user.company?.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}