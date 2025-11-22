// src/application/LiveStream.jsx
import React, { useEffect, useRef } from "react";
import socket from "../../services/socket";

const LiveStream = ({ roomId }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    const Peer = require("simple-peer");

    const startStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        socket.emit("join-room", roomId);

        socket.on("user-joined", (id) => {
          const peer = createPeer(id, socket.id, stream);
          peerRef.current = peer;
        });

        socket.on("signal", ({ from, data }) => {
          peerRef.current?.signal(data);
        });
      } catch (err) {
        console.error("Camera Access Error:", err);
      }
    };

    const createPeer = (userToSignal, callerID, stream) => {
      const peer = new Peer({ initiator: true, trickle: false, stream });

      peer.on("signal", (signal) => {
        socket.emit("signal", {
          to: userToSignal,
          from: callerID,
          data: signal,
        });
      });

      peer.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });

      return peer;
    };

    startStream();

    return () => {
      // Don't disconnect socket globally, just remove listeners
      socket.off("user-joined");
      socket.off("signal");
      peerRef.current?.destroy();
    };
  }, [roomId]);


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded overflow-hidden shadow-lg">
        <h3 className="text-center font-semibold text-sm mb-1">Your Camera</h3>
        <video ref={localVideoRef} autoPlay playsInline muted className="w-full rounded" />
      </div>
      <div className="rounded overflow-hidden shadow-lg">
        <h3 className="text-center font-semibold text-sm mb-1">Remote User</h3>
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full rounded" />
      </div>
    </div>
  );
};

export default React.memo(LiveStream);
