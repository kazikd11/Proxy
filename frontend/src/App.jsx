import React, { useState } from "react";

function App() {
    const [url, setUrl] = useState("");
    const [history, setHistory] = useState([]);
    const [currentUrl, setCurrentUrl] = useState("");
    const [nav, setNav] = useState([]);

    const handleUrlSubmit = (e) => {
        e.preventDefault();
        if (url.trim() === "") return;

        const ensuredUrl = ensureProtocol(url);

        if (!history.find((entry) => entry.url === ensuredUrl)) {
            setHistory([...history, { url: ensuredUrl, favicon: getFaviconUrl(ensuredUrl) }]);
        }
        setCurrentUrl(ensuredUrl);
        setUrl("");
    };

    const handleHistoryClick = (entry) => {
        setCurrentUrl(entry.url);
        // setCount(count + 1);
    };

    const ensureProtocol = (url) => {
        return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
    };

    const getFaviconUrl = (siteUrl) => {
        try {
            const urlObj = new URL(siteUrl);
            return `${urlObj.origin}/favicon.ico`;
        } catch (e) {
            return "";
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

            <div>
                <button onClick={() => setNav([...nav, "back"])}>Back</button>
                <button onClick={() => setNav([...nav, "forward"])}>Forward</button>
            </div>

            <div>
                {history.map((entry, index) => (
                    <div key={index} onClick={() => handleHistoryClick(entry)}>
                        <img src={entry.favicon} alt="favicon" />
                    </div>
                ))}
            </div>

            <div id="content" style={{ height: "600px" }}>
                {currentUrl && (
                    <iframe
                        src={`http://localhost:8080/proxy?url=${currentUrl}`}
                        width="100%"
                        height="100%"
                        title="Proxy Content"
                    ></iframe>
                )}
            </div>
        </div>
    );
}

export default App;
