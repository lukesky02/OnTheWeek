import React, { useState } from 'react';
import '../styles/CategorySelection.css';

const CategorySelection = ({
  categories,
  onCategoryChange,
  onKeywordChange,
}) => {
  // 카테고리의 한글과 영어 매핑
  const categoryMapping = {
    카페: 'cafe',
    음식점: 'restaurant',
    노래방: 'singing',
    목욕탕: 'bath',
    영화관: 'cinema',
  };

  const categoryList = ['카페', '음식점', '노래방', '목욕탕', '영화관'];

  const handleCategoryChange = (category) => {
    // 카테고리 변경 시, 영어로 변환해서 API에 전달
    const englishCategory = categoryMapping[category];
    onCategoryChange(englishCategory);
  };

  return (
    <div className="category-selection">
      <h2>카테고리 선택</h2>
      <div className="category-list">
        {categoryList.map((category, index) => (
          <div key={index} className="category-item">
            <label>
              <input
                type="checkbox"
                value={category}
                checked={categories.includes(categoryMapping[category])} // 영어 카테고리로 체크 여부 확인
                onChange={() => handleCategoryChange(category)} // 영어 카테고리로 변경
              />
              {category}
            </label>
            {categories.includes(categoryMapping[category]) && (
              <div className="keyword-input">
                <input
                  type="text"
                  placeholder={`${category}에 맞는 키워드를 입력`}
                  onChange={(e) => onKeywordChange(e.target.value, category)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySelection;
