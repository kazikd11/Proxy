import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
    const [url, setUrl] = useState("");
    const [count, setCount] = useState([0, 0]);
    const [currentUrl, setCurrentUrl] = useState("");

    const handlePrevious = async () => {
        try {
            const response = await fetch("http://localhost:8080/prev");
            if (response.ok) {
                const data = await response.json();
                setCurrentUrl(data.url);
            }
            else{
            	console.log("Failed to fetch previous")
            }
        } catch (e) {
            console.log(e);
        }
        setCount((x) => [--x[0], x[1]]);

        console.log(count);
    };

    const handleNext = async () => {
        try {
            const response = await fetch("http://localhost:8080/next");
            if (response.ok) {
                const data = await response.json();
                setCurrentUrl(data.url);
            }
            else{
            	console.log("Failed to fetch next")
            }
        } catch (e) {
            console.log(e);
        }
        setCount((x) => [++x[0], x[1]]);

        console.log(count);
    };

    const handleUrlSubmit = async (e) => {
        e.preventDefault();
        if (url !== currentUrl) {
            setCurrentUrl(url);
            setCount((x) => [++x[0], ++x[1]]);
            console.log(count);
        }
    };

    return (
        <div className="App">
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
                <button onClick={handlePrevious} disabled={count[0] === 0}>
                    Previous
                </button>
                <button onClick={handleNext} disabled={count[0] === count[1]}>
                    Next
                </button>
            </div>
            <div id="content" style={{ height: "600px" }}>
                {currentUrl && (
                    <iframe
                        src={`http://localhost:8080/proxy?url=${currentUrl}`}
                        width="100%"
                        height="100%"
                        title="Proxy Content"
						onLoad={() => {
							console.log("Loaded")
						}}
                    ></iframe>
                )}
            </div>
        </div>
    );
}

export default App;
