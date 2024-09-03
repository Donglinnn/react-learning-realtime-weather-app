import styled from "@emotion/styled";
import { ThemeProvider } from "@emotion/react";
import { useState, useEffect, useMemo } from "react";
import { getMoment, findLocation } from "./utils/helpers";
import WeatherCard from "./views/WeatherCard";
import WeatherSetting from "./views/WeatherSetting";
import useWeatherAPI from "./hooks/useWeatherAPI";

const AUTHORIZATION_KEY = "CWA-23A3BB9B-7F54-4022-B931-729EBDC66034";

// 定義亮色及暗色主題
const theme = {
  light: {
    backgroundColor: "#ededed",
    forgroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282",
  },

  dark: {
    backgroundColor: "#1F2022",
    forgroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc",
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function App() {
  // 從localStorage取出之前儲存的地區，若沒有則預設臺北市
  // Lazy Initialization: 在useState帶入函式，該函式的回傳值是state的初始值
  // 而且這個函式只有在元件初次載入時才會執行
  const [currentCity, setCurrentCity] = useState(
    () => localStorage.getItem("cityName") || "臺北市"
  );
  const [currentTheme, setCurrentTheme] = useState("light");
  const [currentPage, setCurrentPage] = useState("WeatherCard");

  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage);
  };
  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity);
  };

  // currentLocation的物件型態：{cityName: "臺北市", locationName: "臺北", sunriseCityName: "臺北市"}
  const currentLocation = useMemo(
    () => findLocation(currentCity),
    [currentCity]
  );
  const { cityName, locationName, sunriseCityName } = currentLocation;

  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    authorizationKey: AUTHORIZATION_KEY,
  });
  useEffect(() => {
    // 根據moment決定使用亮色或深色主題
    setCurrentTheme(moment === "day" ? "light" : "dark");
  }, [moment]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === "WeatherCard" && (
          <WeatherCard
            cityName={cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            handleCurrentPageChange={handleCurrentPageChange}
          />
        )}
        {currentPage === "WeatherSetting" && (
          <WeatherSetting
            cityName={cityName}
            handleCurrentCityChange={handleCurrentCityChange}
            handleCurrentPageChange={handleCurrentPageChange}
          />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
