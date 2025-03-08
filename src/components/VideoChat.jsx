import React, { useState, useRef, useEffect } from 'react';
import Peer from 'peerjs';

const VideoChat = () => {
  const [myID, setMyID] = useState('');
  const [peerID, setPeerID] = useState('');
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);

  useEffect(() => {
    const peer = new Peer();
    peerRef.current = peer;

    peer.on('open', (id) => {
      setMyID(id);
      console.log('My ID:', id);
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      myVideoRef.current.srcObject = stream;

      peer.on('call', (call) => {
        call.answer(stream);
        call.on('stream', (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        });
      });
    });
  }, []);

  const handleCall = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      const call = peerRef.current.call(peerID, stream);
      call.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
      });
    });
  };

  return (
    <div className="p-4">
      <p>Your ID: <b>{myID}</b></p>
      <input
        type="text"
        value={peerID}
        onChange={(e) => setPeerID(e.target.value)}
        placeholder="Enter Peer ID"
      />
      <button onClick={handleCall}>Call</button>

      <div className="flex gap-4 mt-4">
        <div>
          <h3>My Video</h3>
          <video ref={myVideoRef} autoPlay muted className="border" />
        </div>
        <div>
          <h3>Remote Video</h3>
          <video ref={remoteVideoRef} autoPlay className="border" />
        </div>
      </div>
    </div>
  );
};

export default VideoChat;
