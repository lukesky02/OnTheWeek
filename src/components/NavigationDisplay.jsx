import React, { useEffect, useState } from 'react';
import axios from 'axios';

// 카카오 맵 API 키와 카카오 모빌리티 API 키를 환경 변수에서 가져옴
const KAKAO_MAP_API_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY;
const KAKAO_MOBILITY_API_KEY = import.meta.env.VITE_KAKAO_MOBILITY_API_KEY;

const NavigationDisplay = ({ selectedRoute }) => {
  console.log(selectedRoute);
  const [map, setMap] = useState(null);

  useEffect(() => {
    // 카카오 맵 API를 로드
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      // 스크립트가 로드된 후 카카오맵 API 초기화
      window.kakao.maps.load(initializeMap);
    };
    document.head.appendChild(script);
  }, []);

  const initializeMap = () => {
    const mapContainer = document.getElementById('map');

    // 위치 정보가 없으면 기본 위치(건국대학교)로 설정
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const userPosition = new window.kakao.maps.LatLng(userLat, userLng);

          const mapOption = {
            center: userPosition, // 사용자 위치로 지도 중심 설정
            level: 4,
          };

          const mapInstance = new window.kakao.maps.Map(
            mapContainer,
            mapOption
          );
          setMap(mapInstance);

          if (selectedRoute && selectedRoute.length > 1) {
            createNavigationRoute(mapInstance, selectedRoute);
          } else {
            displayMarkers(mapInstance, selectedRoute);
          }
          updateUserMarker(mapInstance); // 사용자 위치 마커 추가
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다.', error);
          // 위치 정보가 없으면 기본 위치로 설정
          const defaultPosition = new window.kakao.maps.LatLng(
            37.541609091148,
            127.0717799526
          ); // 건국대학교
          const mapOption = {
            center: defaultPosition,
            level: 4,
          };

          const mapInstance = new window.kakao.maps.Map(
            mapContainer,
            mapOption
          );
          setMap(mapInstance);

          if (selectedRoute && selectedRoute.length > 1) {
            createNavigationRoute(mapInstance, selectedRoute);
          } else {
            displayMarkers(mapInstance, selectedRoute); // 마커만 표시
          }
          updateUserMarker(mapInstance); // 사용자 위치 마커 추가
        }
      );
    } else {
      // 위치 정보가 지원되지 않는 경우 기본 위치 설정
      const defaultPosition = new window.kakao.maps.LatLng(
        37.541609091148,
        127.0717799526
      ); // 건국대학교
      const mapOption = {
        center: defaultPosition,
        level: 3,
      };

      const mapInstance = new window.kakao.maps.Map(mapContainer, mapOption);
      setMap(mapInstance);

      if (selectedRoute && selectedRoute.length > 1) {
        createNavigationRoute(mapInstance, selectedRoute);
      } else {
        displayMarkers(mapInstance, selectedRoute);
      }
      updateUserMarker(mapInstance);
    }
  };

  const createNavigationRoute = async (map, places) => {
    // selectedRoute가 하나일 때는 카카오모빌리티 API를 사용하지 않고 마커만 표시
    if (places.length > 1) {
      const routeData = await getOptimizedRoute(places);
      if (routeData) {
        displayRouteOnMap(map, routeData); // 경로 시각화
      }
    }
    displayMarkers(map, places); // 마커 추가
  };

  const getOptimizedRoute = async (places) => {
    const url = 'https://apis-navi.kakaomobility.com/v1/waypoints/directions';

    // places 배열을 LatLng 객체로 변환 (lat, lng 값이 유효한지 확인)
    const formattedPlaces = places
      .map((place) => {
        if (
          place &&
          typeof place.location[1] === 'number' &&
          typeof place.location[0] === 'number'
        ) {
          return new window.kakao.maps.LatLng(
            place.location[1],
            place.location[0]
          ); // LatLng로 변환
        } else {
          console.error('유효하지 않은 lat, lng 값:', place);
          return null; // 유효하지 않으면 null을 반환
        }
      })
      .filter((place) => place !== null); // null을 필터링

    if (formattedPlaces.length < 2) {
      console.error('경로를 생성하기 위한 장소가 부족합니다.');
      return null;
    }

    const origin = formattedPlaces[0];
    const destination = formattedPlaces[formattedPlaces.length - 1];
    const waypoints = formattedPlaces.slice(1, -1); // 첫 번째와 마지막을 제외한 경유지들

    // LatLng 객체에서 정확하게 x (lng)와 y (lat) 값을 가져오기
    const params = {
      origin: { x: origin.getLng(), y: origin.getLat() },
      destination: { x: destination.getLng(), y: destination.getLat() },
      waypoints: waypoints.map((place) => ({
        x: place.getLng(),
        y: place.getLat(),
      })),
      priority: 'RECOMMEND', // 우선순위 설정
      car_fuel: 'GASOLINE', // 차량 연료 종류 설정
    };

    console.log(params); // 요청 파라미터를 콘솔로 출력해서 확인

    try {
      const response = await axios.post(url, params, {
        headers: {
          Authorization: 'KakaoAK ' + KAKAO_MOBILITY_API_KEY, // 카카오 API 키 추가
        },
      });
      console.log(response.data); // 응답 데이터 로그
      return response.data; // 경로 데이터 반환
    } catch (error) {
      console.error('경로 계산 실패:', error);
    }
  };

  const displayRouteOnMap = (map, routeData) => {
    if (!routeData || !routeData.routes || routeData.routes.length === 0) {
      console.error('유효한 경로 데이터가 없습니다:', routeData);
      return;
    }

    const routeCoordinates = [];
    const sections = routeData.routes[0].sections;

    if (!sections || sections.length === 0) {
      console.error('경로 섹션 정보가 없습니다:', routeData);
      return;
    }

    // 경로의 모든 좌표 수집
    sections.forEach((section) => {
      if (section.roads) {
        section.roads.forEach((road) => {
          if (road.vertexes) {
            for (let i = 0; i < road.vertexes.length; i += 2) {
              const lat = road.vertexes[i + 1];
              const lng = road.vertexes[i];
              const latLng = new window.kakao.maps.LatLng(lat, lng);
              routeCoordinates.push(latLng);
            }
          }
        });
      }
    });

    // 경로를 지도에 폴리라인으로 표시
    const polyline = new window.kakao.maps.Polyline({
      path: routeCoordinates,
      strokeWeight: 5,
      strokeColor: '#ff0000',
      strokeOpacity: 1,
      strokeStyle: 'solid',
    });

    polyline.setMap(map);
  };

  const displayMarkers = (map, places) => {
    const markerImageSrc =
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
    const markerImageSize = new window.kakao.maps.Size(24, 35);
    const markerImage = new window.kakao.maps.MarkerImage(
      markerImageSrc,
      markerImageSize
    );

    places.forEach((place, index) => {
      if (place.location && place.location.length === 2) {
        const lat = place.location[1]; // 위도
        const lng = place.location[0]; // 경도

        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          map: map,
          position: new window.kakao.maps.LatLng(lat, lng), // LatLng 객체 사용
          title: `장소 ${index + 1}`,
          image: markerImage,
        });

        const infoWindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px; font-size:12px;">${index + 1}. ${
            place.name
          }</div>`,
        });

        infoWindow.open(map, marker);
      } else {
        console.error('유효하지 않은 장소:', place);
      }
    });
  };

  const updateUserMarker = (map) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const userPosition = new window.kakao.maps.LatLng(userLat, userLng);

        const marker = new window.kakao.maps.Marker({
          position: userPosition,
          map: map,
          title: '사용자 위치',
        });

        const infoWindow = new window.kakao.maps.InfoWindow({
          content: '<div>내 위치</div>',
        });

        infoWindow.open(map, marker);
      });
    }
  };

  return <div id="map" style={{ width: '100%', height: '500px' }}></div>;
};

export default NavigationDisplay;
