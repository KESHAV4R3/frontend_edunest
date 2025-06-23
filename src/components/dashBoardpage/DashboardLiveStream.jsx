// src/components/DashboardLiveStream.jsx
import React, { useState } from "react";
import LiveStream from "../application/LiveStream"; // This is your video streaming component
import { apiLinks } from "../../services/apiLink";
import { apiConnector } from "../../services/apiConnector";
import { useSelector } from "react-redux";

const DashboardLiveStream = () => {
  const [sessionId, setSessionId] = useState(null);
  const [title, setTitle] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const { user, personalData } = useSelector((state) => state.profile);

  const handleStartStream = async () => {
    try {
      const response = await apiConnector("post", apiLinks.start, null, {
        title,
        instructorId: user?.id,
      });

      if (response?.data?.sessionId) {
        setSessionId(response.data.sessionId);
        setIsStreaming(true);
      }
    } catch (error) {
      console.error("Start Live Stream Error:", error.response?.data || error);
    }
  };

  const handleEndStream = async () => {
    try {
      const res = await apiConnector("post", apiLinks.end, null, {
        sessionId,
      });

      if (res?.message) {
        setIsStreaming(false);
        setSessionId(null);
        setTitle("");
      }
    } catch (error) {
      console.error("Error ending stream:", error);
    }
  };

  return (
    <div>
      <h2>📺 Dashboard - Live Stream</h2>

      {!isStreaming ? (
        <div>
          <input
            type="text"
            placeholder="Enter stream title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={handleStartStream}>Start Live Stream</button>
        </div>
      ) : (
        <div>
          <LiveStream sessionId={sessionId} isInstructor={true} />
          <button
            onClick={handleEndStream}
            style={{
              marginTop: "1rem",
              backgroundColor: "red",
              color: "white",
            }}
          >
            End Live Stream
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardLiveStream;
