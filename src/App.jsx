import React, { useState, useEffect } from 'react';
import CategorySelection from './components/CategorySelection';
import RouteSelection from './components/RouteSelection';
import RouteDisplay from './components/RouteDisplay';
import NavigationDisplay from './components/NavigationDisplay';
import Header from './components/Header';
import fetchRoutes from './services/apiService';
import './styles/App.css';

function App() {
  const [categories, setCategories] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [type, setType] = useState('random');
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRouteView, setIsRouteView] = useState(false);
  const [isNavigationView, setIsNavigationView] = useState(false);

  const [userLocation, setUserLocation] = useState({
    latitude: 37.541609091148, // 기본 위도 (예: 건국대학교)
    longitude: 127.0717799526, // 기본 경도 (예: 건국대학교)
  });

  // GPS 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('GPS 정보를 가져올 수 없습니다:', error);
          alert('위치 정보를 가져올 수 없어 기본 위치를 사용합니다.');
        }
      );
    } else {
      alert('이 브라우저는 GPS를 지원하지 않습니다.');
    }
  }, []);

  const handleCategoryChange = (category) => {
    setCategories((prevCategories) => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter((c) => c !== category);
      } else {
        return [...prevCategories, category];
      }
    });
  };

  const handleKeywordChange = (event) => {
    const value = event.target.value;
    setKeywords(value ? value.split(',').map((keyword) => keyword.trim()) : []);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleFetchRoutes = async () => {
    if (categories.length === 0) {
      alert('카테고리를 선택해주세요.');
      return;
    }

    setLoading(true);

    const finalKeywords = Array.isArray(keywords) ? keywords : [];

    try {
      const fetchedRoutes = await fetchRoutes(
        categories,
        finalKeywords,
        type,
        userLocation.latitude, // 현재 위치 위도
        userLocation.longitude // 현재 위치 경도
      );
      setRoutes(fetchedRoutes);
      setIsRouteView(true);
    } catch (error) {
      console.error('경로를 불러오는 데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSelect = (routeIndex) => {
    setSelectedRoute(routeIndex);
  };

  const handleBackToMain = () => {
    setIsRouteView(false);
    setIsNavigationView(false);
  };

  const handleNavigate = () => {
    setIsRouteView(false);
    setIsNavigationView(true);
  };

  return (
    <div className="App">
      <Header />
      {!isRouteView && !isNavigationView ? (
        <>
          <CategorySelection
            categories={categories}
            onCategoryChange={handleCategoryChange}
            onKeywordChange={handleKeywordChange}
          />
          <RouteSelection
            categories={categories}
            keywords={keywords}
            type={type}
            onTypeChange={handleTypeChange}
          />
          <button onClick={handleFetchRoutes} disabled={loading}>
            {loading ? '로딩 중...' : '추천된 동선 보기'}
          </button>
        </>
      ) : isRouteView ? (
        <RouteDisplay
          routes={routes}
          onRouteSelect={handleRouteSelect}
          selectedRoute={selectedRoute}
          onBack={handleBackToMain}
          onNavigate={handleNavigate}
        />
      ) : (
        <NavigationDisplay selectedRoute={routes[selectedRoute]} />
      )}
    </div>
  );
}

export default App;
