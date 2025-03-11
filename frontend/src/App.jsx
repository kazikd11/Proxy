import React, { useState } from "react";
import { motion } from "framer-motion";
import './index.css';

function App() {
    const [url, setUrl] = useState("");
    const [history, setHistory] = useState([]);
    const [currentUrl, setCurrentUrl] = useState("");
    const [count, setCount] = useState(null);

    const handleUrlSubmit = (e) => {
        e.preventDefault();
        if (url.trim() === "") return;

        const ensuredUrl = ensureProtocol(url);

        if (!history.find((entry) => entry.url === ensuredUrl)) {
            setHistory((prevHistory) => [
                ...prevHistory,
                { url: ensuredUrl, favicon: getFaviconUrl(ensuredUrl) }
            ]);
        }
        setCurrentUrl(ensuredUrl);
        setUrl("");
        setCount(history.length);
    };

    const handleHistoryClick = (entry, index) => {
        setCurrentUrl(entry.url);
        setCount(index);
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

    const handleBack = () => {
        if (count > 0) {
            const prevUrl = history[count - 1];
            setCurrentUrl(prevUrl.url);
            setCount(count - 1); 
        }
    };

    const handleForward = () => {
        if (count < history.length - 1) {
            const nextUrl = history[count + 1];
            setCurrentUrl(nextUrl.url);
            setCount(count + 1); 
        }
    };

    return (
        <div className="bg-quaternary text-primary min-h-screen p-5 flex flex-col items-center h-[100vh]">
            <form onSubmit={handleUrlSubmit} className="mb-4">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter URL"
                    className="p-2 rounded-md focus:outline-none bg-quaternary"
                />
                <button type="submit" className={`ml-2 p-2 rounded-md ${url.trim() === "" ? 'text-tertiary' : ''}`}>
                    Go
                </button>
            </form>

            <div className="flex space-x-2 mb-4">
                <button
                    onClick={handleBack}
                    className={`p-2 rounded-md ${count <= 0 ? 'text-tertiary' : ''}`}
                    disabled={count <= 0}
                >
                    Back
                </button>
                <button
                    onClick={handleForward}
                    className={`p-2 rounded-md ${count >= history.length - 1 ? 'text-tertiary' : ''}`}
                    disabled={count >= history.length - 1}
                >
                    Forward
                </button>
            </div>

            <div className="flex space-x-2 mb-4 h-20">
                {history.map((entry, index) => (
                    <motion.button
                        key={index}
                        onClick={() => handleHistoryClick(entry, index)}
                        className={`p-0 m-0 flex items-center justify-center border-tertiary w-14 h-14 rounded-lg
                            ${count === index ? 'border-4' : 'border-2'} `}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    >
                        <img
                            src={entry.favicon || '/default-favicon.ico'}
                        />
                    </motion.button>
                ))}
            </div>

            <div id="content" className="w-full h-full border-2">
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
