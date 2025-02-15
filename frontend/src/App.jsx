import React, { useState } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentUrl, setCurrentUrl] = useState('');

  const handleNavigate = (direction) => {
    let newIndex = currentIndex;
    if (direction === 'next' && currentIndex < history.length - 1) {
      newIndex++;
    } else if (direction === 'prev' && currentIndex > 0) {
      newIndex--;
    }

    if (newIndex >= 0 && newIndex < history.length) {
      setUrl(history[newIndex]);
      setCurrentIndex(newIndex);
    }
  };

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    setCurrentUrl(url);
    console.log('URL:', url);
    if (url && !history.includes(url)) {
      setHistory([...history, url]);
      setCurrentIndex(history.length);

    }
  };

  return (
    <div className="App">
      <h1>Simple Proxy with History</h1>
      <form onSubmit={handleUrlSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
        />
        <button type="submit">Go</button>
      </form>

      <div className="navigation-buttons">
        <button onClick={() => handleNavigate('prev')} disabled={currentIndex <= 0}>
          Previous
        </button>
        <button onClick={() => handleNavigate('next')} disabled={currentIndex >= history.length - 1}>
          Next
        </button>
      </div>

      <iframe
        src={`http://localhost:8080/proxy?url=${currentUrl}`}
        width="100%"
        height="600px"
        title="Proxy Content"
      ></iframe>
    </div>
  );
}

export default App;
