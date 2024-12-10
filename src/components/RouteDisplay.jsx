import React from 'react';

const RouteDisplay = ({
  routes,
  onRouteSelect,
  selectedRoute,
  onBack,
  onNavigate, // 네비게이션 화면으로 이동하는 함수
  onRetry, // 동선을 새로 받는 함수
}) => {
  return (
    <div className="route-view">
      {/* 뒤로가기 버튼 */}
      <button onClick={onBack} className="back-button">
        뒤로가기
      </button>

      {/* 경로 표시 */}
      <div className="route-list">
        {routes.map((route, routeIndex) => (
          <div key={routeIndex} className="route-item">
            <input
              type="checkbox"
              checked={selectedRoute === routeIndex} // 1개만 선택 가능
              onChange={() => onRouteSelect(routeIndex)}
              className="route-checkbox"
            />
            {route.map((place, index) => (
              <React.Fragment key={index}>
                <span className="route-place">{place.name}</span>
                {index < route.length - 1 && (
                  <span className="route-arrow">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>

      {/* 하단 버튼 영역 */}
      <div className="action-buttons">
        {/* 재시도 버튼 */}
        <button onClick={onRetry} className="retry-button">
          재시도
        </button>

        {/* 확인 버튼: 선택한 경로가 있을 때만 보이도록 */}
        {selectedRoute !== null && (
          <button onClick={onNavigate} className="confirm-button">
            확인
          </button>
        )}
      </div>
    </div>
  );
};

export default RouteDisplay;
