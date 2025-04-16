import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroupSettings = ({ groupId }) => {
  // Replace with your actual group ID if not passed via props
  // const groupId = '12345';

  // The base API endpoint
  const API_BASE_URL = 'https://8rtdjjqrv7.execute-api.us-east-2.amazonaws.com';
  // Construct the full config endpoint for the given group
  const configEndpoint = `${API_BASE_URL}/research-groups/${groupId}/config`;

  // Global settings
  const [fontFace, setFontFace] = useState('Arial');
  const [colorScheme, setColorScheme] = useState('#500000');

  // Per-question settings
  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch existing settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(configEndpoint);
        const data = response.data;
        setFontFace(data.fontFace || 'Arial');
        setColorScheme(data.colorScheme || '#500000');
        setQuestions(data.questions || []);
      } catch (err) {
        setError('Error fetching group settings');
        // We still want to show the form so the user can edit anyway
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [configEndpoint]);

  // Add a new blank question (per-question fields)
  const addQuestion = () => {
    setQuestions([...questions, { question: '', delay: '', preAnswer: '', answer: '' }]);
  };

  // Update a question field
  const updateQuestion = (index, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  // Remove a question
  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  // Save settings (PUT for “upsert”)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(configEndpoint, {
        fontFace,
        colorScheme,
        questions,
      });
      alert('Settings saved successfully.');
    } catch (err) {
      setError('Error saving group settings');
    }
  };

  const inputStyle = {
    padding: '0.75rem',
    margin: '0.75rem 0',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1>Group Settings - Survey Builder</h1>
      {loading && <p>Loading settings...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Always render the form, even if error */}
      <form onSubmit={handleSubmit}>
        {/* Global Settings */}
        <div>
          <label>Font Face:</label>
          <select
            value={fontFace}
            onChange={(e) => setFontFace(e.target.value)}
            style={inputStyle}
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
          </select>
        </div>

        <div>
          <label>Color Scheme:</label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '0.75rem',
            }}
          >
            <input
              type="color"
              value={colorScheme}
              onChange={(e) => setColorScheme(e.target.value)}
              style={{ ...inputStyle, padding: '0.5rem', width: '50px', margin: 0 }}
            />
            {/* Preview Box */}
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: colorScheme,
              }}
            />
          </div>
        </div>

        <hr />

        <h2>Questions</h2>
        {questions.map((q, index) => (
          <div
            key={index}
            style={{
              marginBottom: '1.5rem',
              border: '1px solid #eee',
              padding: '1rem',
              borderRadius: '8px',
            }}
          >
            <h3>Question {index + 1}</h3>
            <div style={{ marginBottom: '0.75rem' }}>
              <label>Question Text:</label>
              <input
                type="text"
                value={q.question}
                onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label>Delay Parameters (ms):</label>
              <input
                type="number"
                placeholder="e.g., 1000"
                value={q.delay}
                onChange={(e) => updateQuestion(index, 'delay', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label>Pre-Answer Messaging:</label>
              <input
                type="text"
                placeholder="Type your pre-answer message"
                value={q.preAnswer}
                onChange={(e) => updateQuestion(index, 'preAnswer', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <label>Answer:</label>
              <textarea
                placeholder="Enter answer"
                value={q.answer}
                onChange={(e) => updateQuestion(index, 'answer', e.target.value)}
                required
                style={{ ...inputStyle, minHeight: '80px' }}
              />
            </div>
            <button
              type="button"
              onClick={() => removeQuestion(index)}
              style={{ padding: '0.75rem 1rem', marginBottom: '0.75rem' }}
            >
              Remove Question
            </button>
            <hr />
          </div>
        ))}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            type="button"
            onClick={addQuestion}
            style={{ padding: '0.75rem 1.25rem' }}
          >
            Add Question
          </button>
          <button type="submit" style={{ padding: '0.75rem 1.25rem' }}>
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupSettings;
