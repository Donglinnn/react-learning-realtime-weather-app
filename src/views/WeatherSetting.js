import React, { useState } from "react";
import styled from "@emotion/styled";
import { availableLocations } from "../utils/helpers";

/* 
  此文件定義了本專案的第二個畫面－地區設定:
  首先透過styled定義了各個元件的CSS屬性:
    1. WeatherSettingWrapper為整個地區設定畫面的外包裝（基底）
    2. Title為畫面左上角的「設定」文字
    3. StyledLabel為中間選單的label，顯示地區兩字
    4. StyledSelect為讓使用者選擇縣市地區的選單
    5. ButtonGroup為畫面左下及右下兩個按鈕的
  主函式定義各元件的排版方式，並根據從App.js傳來的props再傳遞給styled components來顯示畫面的數據。
*/

const WeatherSettingWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 20px;
`;

const Title = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 30px;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 15px;
`;

const StyledSelect = styled.select`
  display: block;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.textColor};
  outline: none;
  width: 100%;
  max-width: 100%;
  color: ${({ theme }) => theme.textColor};
  font-size: 16px;
  padding: 7px 10px;
  margin-bottom: 40px;
  -webkit-appearance: none;
  -moz-appearance: none;
  box-shadow: none;
  outline: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  // > 符號會選取該元素直接的子元素，即Back與Save兩個按鈕。
  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    user-select: none;
    margin: 0;
    letter-spacing: 0.3px;
    line-height: 1;
    cursor: pointer;
    overflow: visible;
    text-transform: none;
    border: 1px solid transparent;
    background-color: transparent;
    height: 35px;
    width: 80px;
    border-radius: 5px;
    font-size: 14px;

    &:focus {
      outline: 0;
      box-shadow: none;
    }

    &::-moz-focus-inner {
      padding: 0;
      border-style: none;
    }
  }
`;

const Back = styled.button`
  && {
    color: ${({ theme }) => theme.textColor};
    border-color: ${({ theme }) => theme.textColor};
  }
`;

const Save = styled.button`
  && {
    color: white;
    background-color: #40a9f3;
  }
`;

// 從App.js傳入縣市名稱與兩個函式
const WeatherSetting = ({
  cityName,
  handleCurrentCityChange,
  handleCurrentPageChange,
}) => {
  // 為避免與window.location物件混淆，取作locationName
  const [locationName, setLocationName] = useState(cityName);

  // 取得使用者選定的縣市，並更新locationName的state
  const handleChange = (e) => {
    setLocationName(e.target.value);
  };

  const handleSave = () => {
    // 將設定的縣市存入localStorage
    localStorage.setItem("cityName", locationName);
    // 將App.js的currentCity設為選定的縣市
    handleCurrentCityChange(locationName);
    // 將畫面換成天氣卡的頁面
    handleCurrentPageChange("WeatherCard");
  };

  return (
    <WeatherSettingWrapper>
      <Title>設定</Title>
      <StyledLabel htmlFor="location">地區</StyledLabel>

      <StyledSelect
        id="location"
        name="location"
        onChange={handleChange}
        value={locationName}
      >
        {/* 使用array的map方法製造出根據availableLocations陣列的cityName的選項們 */}
        {availableLocations.map(({ cityName }) => {
          return (
            <option value={cityName} key={cityName}>
              {cityName}
            </option>
          );
        })}
      </StyledSelect>

      <ButtonGroup>
        <Back onClick={() => handleCurrentPageChange("WeatherCard")}>返回</Back>
        <Save onClick={handleSave}>儲存</Save>
      </ButtonGroup>
    </WeatherSettingWrapper>
  );
};

export default WeatherSetting;
