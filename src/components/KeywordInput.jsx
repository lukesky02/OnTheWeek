import React, { useState, useEffect } from 'react';

const KeywordInput = ({ categories, onSubmitKeywords }) => {
  const [keywords, setKeywords] = useState({});

  useEffect(() => {
    const initialKeywords = categories.reduce((acc, category) => {
      acc[category] = ''; // 기본 키워드는 빈 문자열로 설정
      return acc;
    }, {});
    setKeywords(initialKeywords);
  }, [categories]);

  const handleKeywordChange = (category, value) => {
    setKeywords((prev) => ({ ...prev, [category]: value }));
  };

  const handleSubmit = () => {
    onSubmitKeywords(keywords); // 키워드 전달
  };

  return (
    <div>
      <h2>키워드 입력</h2>
      {categories.map((category) => (
        <div key={category}>
          <label>{category} 키워드:</label>
          <input
            type="text"
            value={keywords[category]}
            onChange={(e) => handleKeywordChange(category, e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleSubmit}>제출</button>
    </div>
  );
};

export default KeywordInput;
