import { useEffect, useState } from "react";
import { getHealth } from "./services/api";

function App() {
  const [status, setStatus] = useState("Checking API...");
  const [error, setError] = useState(null);

  useEffect(() => {
    getHealth()
      .then((data) => {
        setStatus(`${data.service} is healthy`);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  return (
    <main>
      <h1>CaféBarg</h1>

      {error ? (
        <p>API error: {error}</p>
      ) : (
        <p>{status}</p>
      )}
    </main>
  );
}

export default App;