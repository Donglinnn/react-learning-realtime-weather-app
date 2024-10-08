import React from "react";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import WeatherIcon from "../components/WeatherIcon";
import { ReactComponent as AirFlowIcon } from "../images/airFlow.svg";
import { ReactComponent as RainIcon } from "../images/rain.svg";
import { ReactComponent as RefreshIcon } from "../images/refresh.svg";
import { ReactComponent as LoadingIcon } from "../images/loading.svg";
import { ReactComponent as CogIcon } from "../images/cog.svg";

/* 
  此文件定義了本專案的第一個畫面－天氣卡:
  首先透過styled定義了各個元件的CSS屬性:
    1. WeatherCardWrapper為整個天氣卡的外包裝（基底）
    2. Cog為天氣卡右上角的齒輪圖案
    3. Location為左上角顯示的縣市名稱
    4. Description為縣市名稱下顯示的天氣狀況及舒適度
    5. CurrentWeather為中間區塊，分為左右兩區，左側為溫度顯示，右側為天氣狀況圖示，使用flexbox排成左右方向，包含三個元件：
        a. Temperature為溫度字樣
        b. Celsius為攝氏度字樣
        c. WeatherIcon為天氣狀況圖示
    6. AirFlow為風速圖示及實際數字
    7. Rain為降雨機率圖示及實際數字
    8. Refresh為右下角的重新整理按鈕，額外設計了抓取資料時會不斷旋轉的功能，提醒使用者資料正在抓取中。
  主函式定義各元件的排版方式，並根據從App.js傳來的props再傳遞給styled components來顯示畫面的數據。
*/

const WeatherCardWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.forgroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Cog = styled.div`
  svg {
    position: absolute;
    top: 30px;
    right: 15px;
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
`;

const Location = styled.div`
  color: ${({ theme }) => theme.titleColor};
  font-size: 28px;
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 20px;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: ${({ theme }) => theme.textColor};
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: ${({ theme }) => theme.textColor};
  svg {
    width: 15px;
    height: 15px;
    margin-left: 10px;
    cursor: pointer;
    animation: rotate infinite 1.5s linear;
    // 根據從Refresh Component傳入的props的isLoading值決定要不要播放載入動畫
    animation-duration: ${({ isLoading }) => (isLoading ? "1.5s" : "0s")};
  }

  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;

const WeatherCard = ({
  weatherElement,
  moment,
  fetchData,
  handleCurrentPageChange,
  cityName,
}) => {
  // Destruct from weatherElement
  const {
    stationName,
    description,
    windSpeed,
    temperature,
    rainPossibility,
    observationTime,
    isLoading,
    comfortability,
    weatherCode,
  } = weatherElement;

  return (
    <div>
      <WeatherCardWrapper>
        <Cog>
          <CogIcon onClick={() => handleCurrentPageChange("WeatherSetting")} />
        </Cog>

        <Location>{cityName}</Location>
        <Description>
          {description} {comfortability}
        </Description>
        <CurrentWeather>
          <Temperature>
            {Math.round(temperature)}
            <Celsius>&#8451;</Celsius>
          </Temperature>
          <WeatherIcon weatherCode={weatherCode} moment={moment} />
        </CurrentWeather>
        <AirFlow>
          <AirFlowIcon /> {windSpeed}
        </AirFlow>
        <Rain>
          <RainIcon /> {rainPossibility}
        </Rain>
        <Refresh onClick={fetchData} isLoading={isLoading}>
          {/*
            使用瀏覽器原生Intl方法將時間改成中文顯示，
            Intl.DataTimeFormat(<地區>, <設定>)中，第一個參數放中文"zh-TW"，第二個我們希望以數字顯示時和分就好。
            最後透過.format(<時間>)將時間帶入即可。
        */}
          最後觀察時間：
          {new Intl.DateTimeFormat("zh-TW", {
            hour: "numeric",
            minute: "numeric",
          }).format(dayjs(observationTime))}{" "}
          {/* 若目前正在載入中，則使用LoadingIcon，否則使用RefreshIcon。 */}
          {isLoading ? <LoadingIcon /> : <RefreshIcon />}
        </Refresh>
      </WeatherCardWrapper>
    </div>
  );
};

export default WeatherCard;
