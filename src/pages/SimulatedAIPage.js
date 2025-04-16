import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SimulatedAIPage = () => {
  const navigate = useNavigate();

  // State for questions, selected question, API answer messages, rating, etc.
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [preMessage, setPreMessage] = useState("");
  const [finalAnswer, setFinalAnswer] = useState("");
  const [rating, setRating] = useState(0);

  // New states for controlling the different popups/modals.
  const [showConsent, setShowConsent] = useState(true);        // Pre-consent modal state
  const [showPopup, setShowPopup] = useState(false);             // "Explore scenarios" popup state
  const [showThankYouPopup, setShowThankYouPopup] = useState(false); // Thank you modal state

  // Fetch fixed questions when the component mounts.
  useEffect(() => {
    fetch("https://5ybxfcfpw0.execute-api.us-east-2.amazonaws.com/fixed-questions")
      .then(res => {
        if (!res.ok) throw new Error(`GET /fixed-questions failed: ${res.status}`);
        return res.json();
      })
      .then(data => setQuestions(data))
      .catch(err => console.error("Error fetching questions:", err));
  }, []);

  // -----------------------------------
  // Handlers for Pre-Consent Modal
  // -----------------------------------
  const handleAcceptConsent = () => {
    setShowConsent(false);
    setShowPopup(true);
  };

  const handleDeclineConsent = () => {
    // If the user declines consent, log them out.
    navigate('/survey/logout');
  };

  // -----------------------------------
  // Handler for Original Popup (Scenarios Info)
  // -----------------------------------
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // -----------------------------------
  // Question selection logic
  // -----------------------------------
  const handleSelectQuestion = async (q) => {
    setSelectedQuestion(q);
    setPreMessage("");
    setFinalAnswer("");
    setRating(0);

    // Pre-phase API call
    try {
      const res = await fetch("https://5ybxfcfpw0.execute-api.us-east-2.amazonaws.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: q.id, phase: "pre" })
      });
      if (!res.ok) throw new Error(`POST /ask (pre) failed: ${res.status}`);
      const data = await res.json();
      setPreMessage(data.preAnswerMessage || "");
    } catch (err) {
      console.error("Error fetching pre-answer:", err);
      setPreMessage("Error retrieving pre-answer.");
    }

    // Final-phase API call (the delay is handled in the backend)
    try {
      const res2 = await fetch("https://5ybxfcfpw0.execute-api.us-east-2.amazonaws.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: q.id, phase: "final" })
      });
      if (!res2.ok) throw new Error(`POST /ask (final) failed: ${res2.status}`);
      const data2 = await res2.json();
      setFinalAnswer(data2.finalAnswer || "");
    } catch (err) {
      console.error("Error fetching final answer:", err);
      setFinalAnswer("Error retrieving final answer.");
    }
  };

  // -----------------------------------
  // Rating submission logic
  // -----------------------------------
  const handleRate = async () => {
    if (!selectedQuestion) return;
    try {
      const res = await fetch("https://5ybxfcfpw0.execute-api.us-east-2.amazonaws.com/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: selectedQuestion.id, rating })
      });
      if (!res.ok) throw new Error(`POST /rate failed: ${res.status}`);
      const data = await res.json();
      alert(`Rating submitted! ${data.message}`);
    } catch (err) {
      console.error("Error rating answer:", err);
      alert("Failed to submit rating.");
    }
  };

  // -----------------------------------
  // Star rating UI
  // -----------------------------------
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => setRating(i)}
          style={{
            cursor: 'pointer',
            fontSize: '1.5rem',
            color: i <= rating ? 'gold' : '#ccc',
            marginRight: '0.2rem'
          }}
        >
          ★
        </span>
      );
    }
    return <div>{stars}</div>;
  };

  // -----------------------------------
  // Finishing logic to show Thank You popup
  // -----------------------------------
  const handleFinish = () => {
    setShowThankYouPopup(true);
  };

  const handleThankYouLogout = () => {
    // Log the user out by navigating to the logout route.
    navigate('/survey/logout');
  };

  // -----------------------------------
  // Styling for overlays and modals.
  // -----------------------------------
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };
  const modalStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center'
  };
  const containerStyle = { display: 'flex', gap: '2rem', padding: '1rem' };
  const leftStyle = { flex: 1, border: '1px solid #ccc', padding: '1rem' };
  const rightStyle = { flex: 1, border: '1px solid #ccc', padding: '1rem' };

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* 1) PRE-CONSENT MODAL */}
      {showConsent && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <p style={{ marginBottom: '1rem' }}>
              This study is part of ongoing research. Do you consent to participate?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                onClick={handleAcceptConsent}
                style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#500000', color: '#fff', border: 'none', borderRadius: '8px' }}
              >
                Accept
              </button>
              <button
                onClick={handleDeclineConsent}
                style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#aaa', color: '#000', border: 'none', borderRadius: '8px' }}
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2) ORIGINAL POPUP (Scenario Information), only shown if consent was accepted */}
      {!showConsent && showPopup && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <p>
              Please explore each of the AI scenarios created. Be sure to interact with and rate each scenario.
            </p>
            <button onClick={handleClosePopup} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
              Okay
            </button>
          </div>
        </div>
      )}

      {/* 3) Thank You Popup when finishing the survey */}
      {showThankYouPopup && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <p style={{ marginBottom: '1rem' }}>
              Thank you for participating in this survey.
            </p>
            <button
              onClick={handleThankYouLogout}
              style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#500000', color: '#fff', border: 'none', borderRadius: '8px' }}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* 4) MAIN PAGE CONTENT (only visible after user consents) */}
      {!showConsent && (
        <>
          <h1 style={{ textAlign: 'center' }}>AI Dashboard</h1>
          <div style={containerStyle}>
            {/* Left Panel: Questions */}
            <div style={leftStyle}>
              <h2>Questions</h2>
              {questions.map((q) => (
                <div key={q.id} style={{ margin: '0.5rem 0' }}>
                  <button onClick={() => handleSelectQuestion(q)} style={{ cursor: 'pointer' }}>
                    {q.question}
                  </button>
                </div>
              ))}

              {selectedQuestion && (
                <div style={{ marginTop: '1rem' }}>
                  <h3>Selected: {selectedQuestion.question}</h3>
                  {preMessage && (
                    <p style={{ fontStyle: 'italic', color: '#666', marginTop: '0.5rem' }}>
                      {preMessage}
                    </p>
                  )}
                  {finalAnswer && (
                    <p style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>
                      {finalAnswer}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Right Panel: Rating */}
            <div style={rightStyle}>
              <h2>Rate the Answer</h2>
              {!selectedQuestion ? (
                <p>Select a question on the left first.</p>
              ) : (
                <>
                  <div style={{ margin: '1rem 0' }}>
                    {renderStars()}
                  </div>
                  <button
                    onClick={handleRate}
                    disabled={!finalAnswer}
                    style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
                  >
                    Submit Rating
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Finish button */}
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <button onClick={handleFinish} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
              Finished
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SimulatedAIPage;
