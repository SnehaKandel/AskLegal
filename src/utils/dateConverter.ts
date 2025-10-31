
interface BSCalendarData {
  [year: number]: number[];
}

// Nepali calendar data - mapping BS years to the number of days in each month
// More comprehensive data for accurate BS-AD conversion
const bsCalendarData: BSCalendarData = {
  2000: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2001: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2002: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2003: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2004: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2005: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2006: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2007: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2008: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  2009: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2010: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2011: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2012: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2013: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2014: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2015: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2016: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2017: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2018: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2019: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2020: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2021: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2022: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2023: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2024: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2025: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2026: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2027: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2028: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2029: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2030: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2031: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2032: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2033: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2034: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2035: [30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  2036: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2037: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2038: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2039: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2040: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2041: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2042: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2043: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2044: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2045: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2046: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2047: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2048: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2049: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2050: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2051: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2052: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2053: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2054: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2055: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2056: [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
  2057: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2058: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2059: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2060: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2061: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2062: [30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31],
  2063: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2064: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2065: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2066: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  2067: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2068: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2069: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2070: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2071: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2072: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2073: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2074: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2075: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2076: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2077: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2078: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2079: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2081: [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2082: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],  
  2083: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  2084: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  2085: [31, 32, 31, 32, 30, 31, 30, 30, 29, 30, 30, 30],
  2086: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2087: [31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
  2088: [30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30],
  2089: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2090: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
};

// Reference date for BS-AD conversion (1943/4/14 = 2000/1/1)
const BS_REFERENCE_DATE = {
  bs: {
    year: 2000,
    month: 1,
    day: 1
  },
  ad: {
    year: 1943,
    month: 4,
    day: 14
  }
};

// Define Nepali month names
export const nepaliMonths = [
  "Baisakh", "Jestha", "Asar", "Shrawan", "Bhadra", "Ashwin", 
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

// Define English month names
export const englishMonths = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Generate years for dropdowns
export const generateYears = (start: number, end: number): number[] => {
  const years: number[] = [];
  for (let i = start; i <= end; i++) {
    years.push(i);
  }
  return years;
};

// Generate days based on month and year
export const generateDays = (year: number, month: number, isBS: boolean): number[] => {
  const days: number[] = [];
  let daysInMonth = 30; // Default

  if (isBS) {
    // For BS calendar
    if (bsCalendarData[year] && bsCalendarData[year][month - 1]) {
      daysInMonth = bsCalendarData[year][month - 1];
    }
  } else {
    // For AD calendar
    if (month === 2) {
      // February
      daysInMonth = isLeapYear(year) ? 29 : 28;
    } else if ([4, 6, 9, 11].includes(month)) {
      daysInMonth = 30;
    } else {
      daysInMonth = 31;
    }
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  return days;
};

// Check if a year is a leap year (for AD calendar)
const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

// Convert BS to AD
export const convertBSToAD = (bsYear: number, bsMonth: number, bsDay: number): { year: number; month: number; day: number } => {
  // Check if the date is valid
  if (!bsCalendarData[bsYear] || bsDay > (bsCalendarData[bsYear][bsMonth - 1] || 30)) {
    return getTodaysDateAD(); // Return today's date as fallback
  }
  
  // Calculate days from BS reference date to input BS date
  let totalDays = 0;
  
  // Add days for complete years
  for (let year = BS_REFERENCE_DATE.bs.year; year < bsYear; year++) {
    if (bsCalendarData[year]) {
      for (let month = 0; month < 12; month++) {
        totalDays += bsCalendarData[year][month];
      }
    }
  }
  
  // Add days for complete months in the current year
  for (let month = 0; month < bsMonth - 1; month++) {
    if (bsCalendarData[bsYear]) {
      totalDays += bsCalendarData[bsYear][month];
    }
  }
  
  // Add remaining days
  totalDays += bsDay - 1; // -1 because we want to count from reference date
  
  // Calculate AD date
  const referenceAD = new Date(
    BS_REFERENCE_DATE.ad.year,
    BS_REFERENCE_DATE.ad.month - 1,
    BS_REFERENCE_DATE.ad.day
  );
  
  // Add the calculated days to reference AD date
  const resultDate = new Date(referenceAD);
  resultDate.setDate(referenceAD.getDate() + totalDays);
  
  return {
    year: resultDate.getFullYear(),
    month: resultDate.getMonth() + 1,
    day: resultDate.getDate()
  };
};

// Convert AD to BS
export const convertADToBS = (adYear: number, adMonth: number, adDay: number): { year: number; month: number; day: number } => {
  // Create JavaScript Date object for input AD date
  const adDate = new Date(adYear, adMonth - 1, adDay);
  
  // Reference AD date
  const referenceAD = new Date(
    BS_REFERENCE_DATE.ad.year,
    BS_REFERENCE_DATE.ad.month - 1,
    BS_REFERENCE_DATE.ad.day
  );
  
  // Calculate days between reference AD date and input AD date
  const diffDays = Math.floor((adDate.getTime() - referenceAD.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    // Date is before reference date
    return { year: BS_REFERENCE_DATE.bs.year, month: 1, day: 1 };
  }
  
  // Start from BS reference date
  let bsYear = BS_REFERENCE_DATE.bs.year;
  let bsMonth = 1;
  let bsDay = 1;
  
  // Count days and increment BS date
  let daysCount = 0;
  
  // Count years
  while (true) {
    // Check if we're still within the valid year range
    if (!bsCalendarData[bsYear]) {
      break;
    }
    
    // Calculate days in current BS year
    let daysInYear = 0;
    for (let i = 0; i < 12; i++) {
      daysInYear += bsCalendarData[bsYear][i];
    }
    
    if (daysCount + daysInYear <= diffDays) {
      // Increment year and days count
      bsYear++;
      daysCount += daysInYear;
    } else {
      break;
    }
  }
  
  // Count months
  for (let i = 0; i < 12; i++) {
    if (!bsCalendarData[bsYear]) {
      break;
    }
    
    const daysInMonth = bsCalendarData[bsYear][i];
    
    if (daysCount + daysInMonth <= diffDays) {
      // Increment month and days count
      bsMonth++;
      daysCount += daysInMonth;
    } else {
      break;
    }
  }
  
  // Remaining days
  bsDay = diffDays - daysCount + 1;
  
  // Ensure values are within valid range
  if (bsMonth > 12) {
    bsMonth = 12;
  }
  
  if (bsCalendarData[bsYear] && bsDay > bsCalendarData[bsYear][bsMonth - 1]) {
    bsDay = bsCalendarData[bsYear][bsMonth - 1];
  }
  
  return { year: bsYear, month: bsMonth, day: bsDay };
};

// Get today's date in BS
export const getTodaysDateBS = (): { year: number; month: number; day: number } => {
  const today = new Date();
  const adYear = today.getFullYear();
  const adMonth = today.getMonth() + 1;
  const adDay = today.getDate();
  
  return convertADToBS(adYear, adMonth, adDay);
};

// Get today's date in AD
export const getTodaysDateAD = (): { year: number; month: number; day: number } => {
  const today = new Date();
  return {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate()
  };
};

// Format date as string for display
export const formatBSDate = (year: number, month: number, day: number): string => 
  `${year} ${nepaliMonths[month - 1]} ${day}`;

export const formatADDate = (year: number, month: number, day: number): string => 
  `${year} ${englishMonths[month - 1]} ${day}`;

// Function to validate BS date
export const isValidBSDate = (year: number, month: number, day: number): boolean => {
  if (!bsCalendarData[year]) return false;
  if (month < 1 || month > 12) return false;
  const daysInMonth = bsCalendarData[year][month - 1] || 30;
  return day >= 1 && day <= daysInMonth;
};
