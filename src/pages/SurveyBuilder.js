import React, { useState } from 'react';

const SurveyBuilder = () => {
  const [surveyTitle, setSurveyTitle] = useState("Untitled Survey");
  const [surveyDescription, setSurveyDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([...questions, {
      id: Date.now(),
      text: "",
      type: "short-answer",
      options: [],
      required: false
    }]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleQuestionChange = (id, text) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, text } : q)));
  };

  const handleTypeChange = (id, type) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        return {
          ...q,
          type,
          options: (type === 'multiple-choice' || type === 'checkbox' || type === 'dropdown')
            ? ["Option 1"] : []
        };
      }
      return q;
    }));
  };

  const handleOptionChange = (questionId, optionIndex, text) => {
    setQuestions(questions.map(q =>
      q.id === questionId
        ? { ...q, options: q.options.map((opt, i) => i === optionIndex ? text : opt) }
        : q
    ));
  };

  const addOption = (questionId) => {
    setQuestions(questions.map(q =>
      q.id === questionId
        ? { ...q, options: [...q.options, `Option ${q.options.length + 1}`] }
        : q
    ));
  };

  const removeOption = (questionId, optionIndex) => {
    setQuestions(questions.map(q =>
      q.id === questionId
        ? { ...q, options: q.options.filter((_, i) => i !== optionIndex) }
        : q
    ));
  };

  const toggleRequired = (id) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, required: !q.required } : q
    ));
  };

  // Minimal addition: POST the survey to your API
  const saveSurvey = async () => {
    // The old "mock" user feedback
    alert("Survey saved! (Mock Functionality)");
    console.log({ surveyTitle, surveyDescription, questions });

    // Build the object your backend expects
    const payload = {
      surveyTitle,
      surveyDescription,
      questions
    };

    try {
      // If your final domain is different, replace here
      const API_URL = "https://tl2l68tv49.execute-api.us-east-2.amazonaws.com/questions";

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`POST /questions failed with status ${response.status}`);
      }

      const result = await response.json();
      console.log("Survey saved to backend:", result);
      // No further UI changes – or add logic if you want
    } catch (err) {
      console.error("Error saving survey to backend:", err);
    }
  };

  const inputStyle = {
    padding: '0.75rem',
    margin: '0.75rem 0',
    width: '100%',
    boxSizing: 'border-box'
  };

  return (
    <div className="container">
      <h2>Survey Builder</h2>

      <input
        type="text"
        placeholder="Survey Title"
        value={surveyTitle}
        onChange={(e) => setSurveyTitle(e.target.value)}
        style={inputStyle}
      />
      <textarea
        placeholder="Survey Description"
        value={surveyDescription}
        onChange={(e) => setSurveyDescription(e.target.value)}
        style={{ ...inputStyle, minHeight: '80px' }}
      />

      {questions.map((q, index) => (
        <div key={q.id} style={{
          marginBottom: '1rem',
          padding: '1rem',
          border: '1px solid #ccc'
        }}>
          <span style={{ fontWeight: 'bold' }}>Q{index + 1}:</span>
          <input
            type="text"
            placeholder="Enter question text"
            value={q.text}
            onChange={(e) => handleQuestionChange(q.id, e.target.value)}
            style={inputStyle}
          />
          <select
            value={q.type}
            onChange={(e) => handleTypeChange(q.id, e.target.value)}
            style={inputStyle}
          >
            <option value="short-answer">Short Answer</option>
            <option value="paragraph">Paragraph</option>
            <option value="multiple-choice">Multiple Choice</option>
            <option value="checkbox">Checkboxes</option>
            <option value="dropdown">Dropdown</option>
            <option value="linear-scale">Linear Scale</option>
          </select>

          {(q.type === "multiple-choice" ||
            q.type === "checkbox" ||
            q.type === "dropdown") && (
            <div style={{ margin: '0.75rem 0' }}>
              {q.options.map((option, i) => (
                <div key={i} style={{
                  marginBottom: '0.5rem',
                  display: 'flex',
                  gap: '0.5rem'
                }}>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(q.id, i, e.target.value)}
                    style={inputStyle}
                  />
                  <button onClick={() => removeOption(q.id, i)}>❌</button>
                </div>
              ))}
              <button onClick={() => addOption(q.id)}>➕ Add Option</button>
            </div>
          )}

          <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <label>
              Required:
              <input
                type="checkbox"
                checked={q.required}
                onChange={() => toggleRequired(q.id)}
                style={{ marginLeft: '0.5rem' }}
              />
            </label>
            <button onClick={() => removeQuestion(q.id)}>🗑️ Remove</button>
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
        <button onClick={addQuestion}>➕ Add Question</button>
        <button onClick={saveSurvey}>💾 Save Survey</button>
      </div>
    </div>
  );
};

export default SurveyBuilder;