export const COURSES = [
  'Mathematics', 'Physics', 'English', 'Computer Science',
  'Dancing', 'Chess', 'Biology', 'Chemistry',
  'Law', 'Art', 'Medicine', 'Statistics'
];

export const EUROPE = ['Ukraine', 'Denmark', 'Belgium', 'UK', 'Belarus', 'Poland',
  'France', 'Germany', 'Italy', 'Austria', 'Ireland', 'Netherlands', 'Scotland'];
export const ASIA = ['India', 'China', 'Japan', 'Vietnam', 'Singapore'];
export const AMERICA = ['USA', 'Canada', 'Brazil', 'Argentina'];

export const COUNTRIES = [...EUROPE, ...ASIA, ...AMERICA];

export const PHONE_PATTERNS: Record<string, RegExp> = {
  'Iran': /^\d{3}-\d{8}$/,
  'France': /^\d{2}(-\d{2}){4}$/,
  'Switzerland': /^\d{3}\s\d{3}\s\d{2}\s\d{2}$/,
  'Netherlands': /^\(\d{3}\)-\d{3}-\d{4}$/,
  'Canada': /^\d{3}-\d{3}-\d{4}$/,
  'Denmark': /^\d{8}$/,
  'USA': /^\(\d{3}\)-\d{3}-\d{4}$/,
  'Germany': /^\d{4}-\d{7}$/,
  'Finland': /^\d{2}-\d{3}-\d{3}$/,
  'Ireland': /^\d{8}$/,
  'England': /^\d{3}-\d{3}-\d{4}$/,
  'Scotland': /^\d{3}\s\d{3}\s\d{2}\s\d{2}$/,
  'Italy': /^\d{2}(-\d{2}){4}$/,
  'Austria': /^\d{4}-\d{7}$/,
  'Vietnam': /^\d{3}-\d{3}-\d{4}$/
};