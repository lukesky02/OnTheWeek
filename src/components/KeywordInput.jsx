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
    setKeywords((prev) => {
      if (prev[category] !== undefined) {
        return { ...prev, [category]: value };
      } else {
        console.error(`No category found for ${category}`);
        return prev;
      }
    });
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
            value={keywords[category] || ''} // 기본값이 빈 문자열로 처리되도록 수정
            onChange={(e) => handleKeywordChange(category, e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleSubmit}>제출</button>
    </div>
  );
};

export default KeywordInput;
