import sunriseAndSunsetData from "./sunrise-sunset.json";

/* 
  在這個文件中，export了三個物件：
  第一個：getMoment()是一個函數，可以根據給定的縣市區域來回傳當下時刻當地為白天還是夜晚，判斷依據是根據給定的日出日落資料。
  第二個：availableLocations是一個array of objects，每一個物件有三項屬性：縣市名稱、測站名稱及日出城市名稱（目前與縣市名稱相同，但根據中央氣象局更動有可能會有不同）。
  第三個：findLocation()是一個函數，根據給定的縣市名稱從availableLocations找出相應的object。
*/

export const getMoment = (locationName) => {
  // location是從sunrise-sunset.json抓到的資料，是一個物件，包含兩個屬性：
  // locationName：縣市名稱 以及 time: 為一個array of object，每個物件包含當天日期以及日出日落時刻
  const location = sunriseAndSunsetData.find(
    (data) => data.locationName === locationName
  );

  if (!location) {
    throw new Error(`找不到 ${location} 的日出日落資料`);
  }

  const now = new Date();
  // nowDate資料型態： 2024-09-03
  const nowDate = new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(now)
    .replace(/\//g, "-");

  // locationDate即為使用者當下的日期的time屬性物件，包含當日日期及日出日落資料。
  const locationDate = location.time.find((time) => time.dataTime === nowDate);

  if (!locationDate) {
    throw new Error(`找不到 ${locationName} 在 ${nowDate} 的日出日落資料`);
  }

  // 此三個變數紀錄當天日出、日落及使用者當下三個時刻距離1970-01-01的毫秒數。
  const sunriseTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunrise}`
  ).getTime();
  const sunsetTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunset}`
  ).getTime();
  const nowTimeStamp = now.getTime();

  // 透過比較三者的大小，判斷當下屬於夜晚還是白天，回傳"day"或"night"供App.js使用來決定要用淺色模式還是深色模式。
  return sunriseTimestamp <= nowTimeStamp && nowTimeStamp <= sunsetTimestamp
    ? "day"
    : "night";
};

export const availableLocations = [
  {
    cityName: "宜蘭縣",
    locationName: "宜蘭",
    sunriseCityName: "宜蘭縣",
  },
  {
    cityName: "嘉義市",
    locationName: "嘉義",
    sunriseCityName: "嘉義市",
  },
  {
    cityName: "屏東縣",
    locationName: "恆春",
    sunriseCityName: "屏東縣",
  },
  {
    cityName: "苗栗縣",
    locationName: "三義",
    sunriseCityName: "苗栗縣",
  },
  {
    cityName: "雲林縣",
    locationName: "國一N234K",
    sunriseCityName: "雲林縣",
  },
  {
    cityName: "臺東縣",
    locationName: "臺東",
    sunriseCityName: "臺東縣",
  },
  {
    cityName: "臺北市",
    locationName: "臺北",
    sunriseCityName: "臺北市",
  },
  {
    cityName: "金門縣",
    locationName: "金門",
    sunriseCityName: "金門縣",
  },
  {
    cityName: "桃園市",
    locationName: "新屋",
    sunriseCityName: "桃園市",
  },
  {
    cityName: "彰化縣",
    locationName: "彰師大",
    sunriseCityName: "彰化縣",
  },
  {
    cityName: "嘉義縣",
    locationName: "布袋國中",
    sunriseCityName: "嘉義縣",
  },
  {
    cityName: "高雄市",
    locationName: "高雄",
    sunriseCityName: "高雄市",
  },
  {
    cityName: "基隆市",
    locationName: "基隆",
    sunriseCityName: "基隆市",
  },
  {
    cityName: "臺南市",
    locationName: "臺南",
    sunriseCityName: "臺南市",
  },
  {
    cityName: "南投縣",
    locationName: "國三N223K",
    sunriseCityName: "南投縣",
  },
  {
    cityName: "臺中市",
    locationName: "臺中",
    sunriseCityName: "臺中市",
  },
  {
    cityName: "新竹縣",
    locationName: "新竹",
    sunriseCityName: "新竹縣",
  },
  {
    cityName: "花蓮縣",
    locationName: "花蓮",
    sunriseCityName: "花蓮縣",
  },
  {
    cityName: "連江縣",
    locationName: "馬祖",
    sunriseCityName: "連江縣",
  },
  {
    cityName: "澎湖縣",
    locationName: "澎湖",
    sunriseCityName: "澎湖縣",
  },
  {
    cityName: "新北市",
    locationName: "新北",
    sunriseCityName: "新北市",
  },
];

export const findLocation = (cityName) => {
  return availableLocations.find((location) => location.cityName === cityName);
};
