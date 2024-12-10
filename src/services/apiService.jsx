import axios from 'axios';

const fetchRoutes = async (categories, keywords, type, latitude, longitude) => {
  try {
    const requestBody = {
      categories: [...new Set(categories.flat())],
      keyword: keywords.join(', ') || '',
      type: type,
      latitude: latitude, // GPS 위도
      longitude: longitude, // GPS 경도
      radius: 3000,
    };

    console.log('Request Body:', JSON.stringify(requestBody, null, 2));

    const response = await axios.post('/api/route', requestBody);

    let routes = [];

    if (type === 'random') {
      routes = response.data.routes || [];
    } else if (type === 'optimized') {
      const optimizedRoute = response.data.route;
      console.log('Optimized Route:', optimizedRoute);
      routes = [optimizedRoute];
    }

    if (!routes || routes.length === 0) {
      throw new Error('추천된 경로가 없습니다.');
    }

    return routes.map((route) => {
      if (!Array.isArray(route)) {
        throw new Error('경로 데이터가 배열이 아닙니다.');
      }

      return route.map((place) => {
        const location =
          place.location && place.location.coordinates
            ? place.location.coordinates
            : [null, null];
        return {
          name: place.name,
          category: place.category,
          address: place.addr,
          distance: place.distance,
          location: location,
        };
      });
    });
  } catch (error) {
    console.error('Error fetching routes:', error);
    throw error;
  }
};

export default fetchRoutes;
