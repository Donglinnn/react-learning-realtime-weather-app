// 將fetchCurrentWeather和fetchWeatherForecast及拉取API資料的相關部分都整合成一個Hook
import { useState, useEffect, useCallback } from "react";

const fetchCurrentWeather = async ({ authorizationKey, locationName }) => {
  try {
    let response = await fetch(
      `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&StationName=${locationName}`
    );
    const data = await response.json();
    const stationData = data.records.Station[0];
    console.log(stationData);
    const weatherElements = {
      WDSD: stationData.WeatherElement.WindSpeed,
      TEMP: stationData.WeatherElement.AirTemperature,
    };
    return {
      stationName: stationData.StationName,
      windSpeed: weatherElements.WDSD,
      temperature: weatherElements.TEMP,
      observationTime: stationData.ObsTime.DateTime,
    };
  } catch (e) {
    console.log(e);
  }
};

const fetchWeatherForecast = async ({ authorizationKey, cityName }) => {
  try {
    let response = await fetch(
      `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`
    );
    const data = await response.json();
    // console.log(data);
    const locationData = data.records.location[0];
    // 此reduce方法會回傳一個
    const weatherElements = locationData.weatherElement.reduce(
      (neededElements, item) => {
        // Wx是天氣現象，PoP是降雨機率，CI是舒適度
        if (["Wx", "PoP", "CI"].includes(item.elementName)) {
          // 此API會回傳36小時，但我們只取前12小時的資料，因此只取time[0]
          neededElements[item.elementName] = item.time[0].parameter;
        }
        return neededElements;
      },
      {}
    );

    return {
      description: weatherElements.Wx.parameterName,
      weatherCode: weatherElements.Wx.parameterValue,
      rainPossibility: weatherElements.PoP.parameterName,
      comfortability: weatherElements.CI.parameterName,
    };
  } catch (e) {
    console.log(e);
  }
};

const useWeatherAPI = ({ locationName, cityName, authorizationKey }) => {
  const [weatherElement, setWeatherElement] = useState({
    stationName: "",
    description: "",
    windSpeed: 0,
    temperature: 0,
    rainPossibility: 0,
    observationTime: new Date(),
    comfortability: "",
    weatherCode: 0,
    isLoading: true,
  });

  // 當dependencies改變時useCallback會回傳一個新的函式
  // 這樣一來就可以避免掉不斷產生記憶體位址不同但內容相同的fetchData函式
  const fetchData = useCallback(async () => {
    // 只寫isLoading的話會覆蓋其他的資料
    // useState的第二個值的函式setSomething若是帶入函式可以取得前一次的資料狀態，即為prevState
    setWeatherElement((prevState) => ({ ...prevState, isLoading: true }));

    // 使用Promise.all等待兩個API都取得回應後再刷新weatherElement
    const [currentWeather, weatherForecast] = await Promise.all([
      fetchCurrentWeather({ authorizationKey, locationName }),
      fetchWeatherForecast({ authorizationKey, cityName }),
    ]);

    setWeatherElement({
      ...currentWeather,
      ...weatherForecast,
      isLoading: false,
    });
  }, [authorizationKey, cityName, locationName]);

  // 將fetchData放到useEffect的dependencies後，就不會重新叫useEffect內的函式
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 回傳要讓其他元件使用的資料或方法
  return [weatherElement, fetchData];
};

export default useWeatherAPI;
