import React from 'react';
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

  const reverseCategoryMapping = {
    cafe: '카페',
    restaurant: '음식점',
    singing: '노래방',
    bath: '목욕탕',
    cinema: '영화관',
  };

  const categoryList = ['카페', '음식점', '노래방', '목욕탕', '영화관'];

  const handleCategoryChange = (category) => {
    // 카테고리 변경 시, 영어로 변환해서 API에 전달
    const englishCategory = categoryMapping[category];
    onCategoryChange(englishCategory);
  };

  const handleKeywordChange = (category, value) => {
    // 키워드를 영어로 변환하여 전달
    const englishCategory = categoryMapping[category];
    onKeywordChange(englishCategory, value); // 영어 카테고리로 전달
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
                  onChange={(e) =>
                    handleKeywordChange(category, e.target.value)
                  } // 카테고리 영어로 전달
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
