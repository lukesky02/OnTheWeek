// RouteSelection.js
import React from 'react';
import '../styles/RouteSelection.css';

const RouteSelection = ({ categories, keywords, type, onTypeChange }) => {
  return (
    <div className="route-selection">
      <h2>추천 경로</h2>
      <div>
        <h3>경로 유형 선택</h3>
        <select onChange={onTypeChange} value={type}>
          <option value="random">무작위</option>
          <option value="optimized">최적화된 경로</option>
        </select>
      </div>
      <div>
        <h3>선택한 카테고리</h3>
        <ul>
          {categories.map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>입력된 키워드</h3>
        <ul>
          {keywords.map((keyword, index) => (
            <li key={index}>{keyword}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RouteSelection;
