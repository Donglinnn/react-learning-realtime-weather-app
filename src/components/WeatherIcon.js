import React, { useMemo } from "react";
import styled from "@emotion/styled";
import { ReactComponent as DayThunderstorm } from "../images/day-thunderstorm.svg";
import { ReactComponent as DayClear } from "../images/day-clear.svg";
import { ReactComponent as DayCloudyFog } from "../images/day-cloudy-fog.svg";
import { ReactComponent as DayCloudy } from "../images/day-cloudy.svg";
import { ReactComponent as DayFog } from "../images/day-fog.svg";
import { ReactComponent as DayPartiallyClearWithRain } from "../images/day-partially-clear-with-rain.svg";
import { ReactComponent as DaySnowing } from "../images/day-snowing.svg";
import { ReactComponent as NightThunderstorm } from "../images/night-thunderstorm.svg";
import { ReactComponent as NightClear } from "../images/night-clear.svg";
import { ReactComponent as NightCloudyFog } from "../images/night-cloudy-fog.svg";
import { ReactComponent as NightCloudy } from "../images/night-cloudy.svg";
import { ReactComponent as NightFog } from "../images/night-fog.svg";
import { ReactComponent as NightPartiallyClearWithRain } from "../images/night-partially-clear-with-rain.svg";
import { ReactComponent as NightSnowing } from "../images/night-snowing.svg";

const IconContainer = styled.div`
  flex-basis: 30%;

  svg {
    max-height: 110px;
  }
`;

// Convert Weather Codes to weather types
const weatherTypes = {
  isThunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
  isClear: [1],
  isCloudyFog: [25, 26, 27, 28],
  isCloudy: [2, 3, 4, 5, 6, 7],
  isFog: [24],
  isPartiallyClearWithRain: [
    8, 9, 10, 11, 12, 13, 14, 19, 20, 29, 30, 31, 32, 38, 39,
  ],
  isSnowing: [23, 37, 42],
};

// Map weather types to weather icons
const weatherIcons = {
  day: {
    isThunderstorm: <DayThunderstorm />,
    isClear: <DayClear />,
    isCloudyFog: <DayCloudyFog />,
    isCloudy: <DayCloudy />,
    isFog: <DayFog />,
    isPartiallyClearWithRain: <DayPartiallyClearWithRain />,
    isSnowing: <DaySnowing />,
  },
  night: {
    isThunderstorm: <NightThunderstorm />,
    isClear: <NightClear />,
    isCloudyFog: <NightCloudyFog />,
    isCloudy: <NightCloudy />,
    isFog: <NightFog />,
    isPartiallyClearWithRain: <NightPartiallyClearWithRain />,
    isSnowing: <NightSnowing />,
  },
};

// 找出給定的weatherCode對應到的weatherTypes中的weatherType
// 若weatherCode為1，則weatherCodeToType(weatherCode)結果為isClear
const weatherCodeToType = (weatherCode) => {
  const [weatherType] =
    Object.entries(weatherTypes).find(([weatherType, weatherCodes]) =>
      weatherCodes.includes(Number(weatherCode))
    ) || [];

  return weatherType;
};

const WeatherIcon = ({ weatherCode, moment }) => {
  // 將weatherCode轉乘weatherType再根據白天或晚上決定weatherIcon
  // weatherCode發生變化才會導致useMemo重新計算並把值傳回給weatherType
  const weatherType = useMemo(
    () => weatherCodeToType(weatherCode),
    [weatherCode]
  );
  const weatherIcon = weatherIcons[moment][weatherType];

  return <IconContainer>{weatherIcon}</IconContainer>;
};

export default WeatherIcon;
