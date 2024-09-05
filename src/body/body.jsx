import React, { useState, useRef } from 'react';

const Body = () => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnection = useRef(new RTCPeerConnection());
    const [offer, setOffer] = useState("");
    const [answer, setAnswer] = useState("");
    const [remoteOffer, setRemoteOffer] = useState("");
    const [remoteAnswer, setRemoteAnswer] = useState("");
    const [localICE, setLocalICE] = useState("");
    const [remoteICE, setRemoteICE] = useState("");

    const startLocalStream = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));
    };

    const createOffer = async () => {
        const offerDescription = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offerDescription);
        setOffer(JSON.stringify(offerDescription));
    };

    const handleRemoteOffer = async () => {
        const offerDescription = JSON.parse(remoteOffer);
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offerDescription));

        const answerDescription = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answerDescription);
        setAnswer(JSON.stringify(answerDescription));
    };

    const handleRemoteAnswer = async () => {
        const answerDescription = JSON.parse(remoteAnswer);
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answerDescription));
    };

    const handleRemoteICE = async () => {
        const iceCandidate = new RTCIceCandidate(JSON.parse(remoteICE));
        await peerConnection.current.addIceCandidate(iceCandidate);
    };

    peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
            setLocalICE(JSON.stringify(event.candidate));
        }
    };

    peerConnection.current.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
    };

    return (
        <div>
            <h2>Local Video</h2>
            <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '400px' }} />
            <h2>Remote Video</h2>
            <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '400px' }} />

            <div>
                <button onClick={startLocalStream}>Start Local Stream</button>
                <button onClick={createOffer}>Create Offer</button>
            </div>

            <div>
                <h3>Local Offer</h3>
                <textarea value={offer} readOnly style={{ width: '400px', height: '100px' }} />
            </div>

            <div>
                <h3>Remote Offer</h3>
                <textarea value={remoteOffer} onChange={(e) => setRemoteOffer(e.target.value)} style={{ width: '400px', height: '100px' }} />
                <button onClick={handleRemoteOffer}>Set Remote Offer & Create Answer</button>
            </div>

            <div>
                <h3>Local Answer</h3>
                <textarea value={answer} readOnly style={{ width: '400px', height: '100px' }} />
            </div>

            <div>
                <h3>Remote Answer</h3>
                <textarea value={remoteAnswer} onChange={(e) => setRemoteAnswer(e.target.value)} style={{ width: '400px', height: '100px' }} />
                <button onClick={handleRemoteAnswer}>Set Remote Answer</button>
            </div>

            <div>
                <h3>Local ICE Candidate</h3>
                <textarea value={localICE} readOnly style={{ width: '400px', height: '100px' }} />
            </div>

            <div>
                <h3>Remote ICE Candidate</h3>
                <textarea value={remoteICE} onChange={(e) => setRemoteICE(e.target.value)} style={{ width: '400px', height: '100px' }} />
                <button onClick={handleRemoteICE}>Add Remote ICE Candidate</button>
            </div>
        </div>
    );
};

export default Body;