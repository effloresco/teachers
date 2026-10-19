export const COURSES = [
  'Mathematics', 'Physics', 'English', 'Computer Science',
  'Dancing', 'Chess', 'Biology', 'Chemistry',
  'Law', 'Art', 'Medicine', 'Statistics'
];

export const COUNTRIES = [
  { value: 'Ukraine', label: 'Ukraine' },
  { value: 'United States', label: 'USA' },
  { value: 'France', label: 'France' },
  { value: 'Iran', label: 'Iran' },
  { value: 'Switzerland', label: 'Switzerland' },
  { value: 'Netherlands', label: 'Netherlands' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Denmark', label: 'Denmark' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Finland', label: 'Finland' },
  { value: 'Ireland', label: 'Ireland' },
  { value: 'England', label: 'England' },
  { value: 'Scotland', label: 'Scotland' },
  { value: 'Italy', label: 'Italy' },
  { value: 'Austria', label: 'Austria' },
  { value: 'Vietnam', label: 'Vietnam' }
];

function getAlt(teacher: any): string {
  if (teacher.alt) {
    return teacher.alt;
  }

  const firstLetter = teacher.name?.first?.[0];
  const lastLetter = teacher.name?.last?.[0];
  
  if (firstLetter && lastLetter) {
    return `${firstLetter.toUpperCase()}. ${lastLetter.toUpperCase()}`;
  }

  if (teacher.full_name) {
    const names = teacher.full_name.trim().split(" ");
    
    if (names.length >= 2 && names[0]?.[0] && names[1]?.[0]) {
      return `${names[0][0].toUpperCase()}. ${names[1][0].toUpperCase()}`;
    }
    
    if (names.length === 1 && names[0]?.[0]) {
      return `${names[0][0].toUpperCase()}.`;
    }
  }

  return '';
}

export function transformUsers(randomUsers: any[], additionalUsers: any[]): any[] {
  const combined = [...randomUsers, ...additionalUsers];
  const uniqueMap = new Map();

  for (const item of combined) {
    const formattedUser = {
      gender: item.gender?.toLowerCase() || '',
      title: item.title || item.name?.title || '',
      full_name: item.full_name || (item.name ? `${item.name.first} ${item.name.last}` : ''),
      city: item.city || item.location?.city || '',
      state: item.state || item.location?.state || '',
      country: item.country || item.location?.country || '',
      postcode: item.postcode || item.location?.postcode || '',
      coordinates: item.coordinates || item.location?.coordinates || { latitude: '0', longitude: '0' },
      timezone: item.timezone || item.location?.timezone || { offset: '0:00', description: '' },
      email: item.email || '',
      b_date: item.b_date || item.b_day || item.dob?.date || '',
      age: item.age ?? item.dob?.age ?? '',
      phone: item.phone || '',
      picture_large: item.picture_large || item.picture?.large || '',
      picture_thumbnail: item.picture_thumbnail || item.picture?.thumbnail || '',
      id: typeof(item.id) === 'string' && item.id || item.login?.uuid || crypto.randomUUID(),
      favorite: item.favorite,
      course: item.course || getRandomCourse(),
      bg_color: item.bg_color || '#ffffff',
      note: item.note || '',
      alt: getAlt(item)
    };

    const key = formattedUser.id;

    if (key && !uniqueMap.has(key)) {
      uniqueMap.set(key, formattedUser);
    }
  }

  return Array.from(uniqueMap.values());
}

export function getRandomCourse(): string {
  const index = Math.floor(Math.random() * COURSES.length);
  return COURSES[index];
}

export const PHONE_PATTERNS: Record<string, RegExp> = {
  'Iran': /^\d{3}-\d{8}$/,
  'France': /^\d{2}(-\d{2}){4}$/,
  'Switzerland': /^\d{3}\s\d{3}\s\d{2}\s\d{2}$/,
  'Netherlands': /^\(\d{3}\)-\d{3}-\d{4}$/,
  'Canada': /^\d{3}-\d{3}-\d{4}$/,
  'Denmark': /^\d{8}$/,
  'United States': /^\(\d{3}\)-\d{3}-\d{4}$/,
  'Germany': /^\d{4}-\d{7}$/,
  'Finland': /^\d{2}-\d{3}-\d{3}$/,
  'Ireland': /^\d{8}$/,
  'England': /^\d{3}-\d{3}-\d{4}$/,
  'Scotland': /^\d{3}\s\d{3}\s\d{2}\s\d{2}$/,
  'Italy': /^\d{2}(-\d{2}){4}$/,
  'Austria': /^\d{4}-\d{7}$/,
  'Vietnam': /^\d{3}-\d{3}-\d{4}$/
};

export function isCapitalizedString(val: any): boolean {
  if (typeof val !== 'string' || val.trim().length === 0) {
    return false;
  }
  const firstChar = val.trim()[0];
  return firstChar === firstChar.toUpperCase() && firstChar !== firstChar.toLowerCase();
}

export function isValidPhone(phone: any, country: string): boolean {
  if (typeof phone !== 'string') return false;
  const pattern = PHONE_PATTERNS[country];
  return pattern?.test(phone);
}

export function validateUser(user: any): boolean {
  if (!user || typeof user !== 'object') return false;

  const stringFields = ['full_name'/*, 'state', 'city', 'country'*/];

  const isStringsValid = stringFields.every(field => isCapitalizedString(field));

  const isNoteValid = !user.note || isCapitalizedString(user.note);

  const isAgeValid = typeof user.age === 'number' && !isNaN(user.age);

  const isPhoneValid = isValidPhone(user.phone, user.country);

  const isEmailValid = typeof user.email === 'string' && user.email.includes('@');

  return isStringsValid /* && isAgeValid && isPhoneValid &&isEmailValid && isNoteValid*/;
}

export function getRegion(country: string): string {
  const europe = ['Ukraine', 'Denmark', 'Belgium', 'UK', 'Belarus', 'Poland', 'France', 'Germany', 'Italy', 'Austria', 'Ireland', 'Netherlands', 'Scotland'];
  const asia = ['India', 'China', 'Japan', 'Vietnam', 'Singapore'];
  const america = ['USA', 'Canada', 'Brazil', 'Argentina'];

  if (europe.includes(country)) return 'Europe';
  if (asia.includes(country)) return 'Asia';
  if (america.includes(country)) return 'America';
  return 'Other';
}

export function filterTeachers(teachers: any[], filters: { country: string, age: string, region: string, sex: string, onlyPhoto: boolean, onlyFavorites: boolean }) {
  return teachers.filter(teacher => {

    if (filters.country && filters.country !== '' && filters.country.toLowerCase() !== 'all') {
      if (filters.country !== undefined) {
        if (teacher.country?.toLowerCase() !== filters.country.toLowerCase()) {
          return false;
        }
      }
    }

    if (filters.age && filters.age !== '' && filters.age.toLowerCase() !== 'all') {
      if (filters.age === '21-30' && (teacher.age < 21 || teacher.age > 30)) return false;
      if (filters.age === '30-35' && (teacher.age < 30 || teacher.age > 35)) return false;
      if (filters.age === '35+' && teacher.age < 35) return false;
    }

    if (filters.region && filters.region !== '' && filters.region.toLowerCase() !== 'all') {
      const region = getRegion(teacher.country);
      if (region !== filters.region) return false;
    }

    if (filters.sex && filters.sex !== '' && filters.sex.toLowerCase() !== 'all') {
      if (!teacher.gender || teacher.gender.toLowerCase() !== filters.sex.toLowerCase()) return false;
    }

    if (filters.onlyPhoto) {
      if (!teacher.picture_large || teacher.picture_large.trim() === '') {
        return false;
      }
    }

    if (filters.onlyFavorites) {
      if (!teacher.favorite) return false;
    }

    return true;
  });
}

export type SortField = 'full_name' | 'course' | 'age' | 'b_day' | 'b_date' | 'country' | 'gender';
export type SortOrder = 'asc' | 'desc';

export function sortUsers(
  users: any[],
  field: SortField,
  order: SortOrder = 'asc'
): any[] {
  if (!users || users.length === 0 || !field) {
    return users;
  }

  const direction = order === 'desc' ? -1 : 1;

  return [...users].sort((a, b) => {
    let valA = a[field];
    let valB = b[field];

    if (field === 'b_day' && valA === undefined) valA = a.b_date;
    if (field === 'b_day' && valB === undefined) valB = b.b_date;

    if (valA == null && valB == null) return 0;
    if (valA == null) return 1;
    if (valB == null) return -1;

    if (typeof valA === 'number' && typeof valB === 'number') {
      return (valA - valB) * direction;
    }

    if (field === 'b_day' || field === 'b_date') {
      const dateA = new Date(valA).getTime();
      const dateB = new Date(valB).getTime();
      if (!isNaN(dateA) && !isNaN(dateB)) {
        return (dateA - dateB) * direction;
      }
    }

    return String(valA).localeCompare(String(valB), undefined, {
      numeric: true,
      sensitivity: 'base'
    }) * direction;
  });
}

export type SearchField = 'name' | 'full_name' | 'note' | 'age';

export function findUsers(users: any[], query: string | number, field?: SearchField): any[] {
  if (!users || users.length === 0 || query === undefined || query === null) {
    return [];
  }

  const queryStr = String(query).trim().toLowerCase();

  return users.filter(user => {

    if (field) {
      const val = user[field];

      if (val === undefined || val === null) return false;

      if (typeof val === 'number' || typeof query === 'number') {
        return Number(val) === Number(query);
      }

      return String(val).toLowerCase().includes(queryStr);
    }

    const nameVal = user.full_name || user.name || '';
    const noteVal = user.note || '';
    const ageVal = user.age;

    if (typeof query === 'number' || (!isNaN(Number(query)) && queryStr !== '')) {
      if (Number(ageVal) === Number(query)) {
        return true;
      }
    }

    const matchesName = String(nameVal).toLowerCase().includes(queryStr);
    const matchesNote = String(noteVal).toLowerCase().includes(queryStr);

    return matchesName || matchesNote;
  });
}

export function getMatchingPercentage(
  users: any[],
  predicate: (user: any) => boolean
): number {
  if (!users || users.length === 0) {
    return 0;
  }

  const matchingCount = users.filter(predicate).length;

  const percentage = (matchingCount / users.length) * 100;

  return Number(percentage.toFixed(2));
}

export function calculateAge(dob: string): number | '' {
  if (!dob) return '';
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return '';
  const diff = Date.now() - birthDate.getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
}

export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || ''
  };
}

export function createNewTeacher(formData: {
  full_name: string;
  course: string;
  country: string;
  city: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  bgColor: string;
  note: string;
}) {
  const { firstName, lastName } = splitFullName(formData.full_name);
  const age = calculateAge(formData.dob);
  console.log(getAlt(formData))
  return {
    id: crypto.randomUUID(),
    full_name: formData.full_name,
    firstName: firstName,
    lastName: lastName,
    course: formData.course,
    country: formData.country,
    city: formData.city,
    email: formData.email,
    phone: formData.phone,
    b_date: formData.dob,
    age: age,
    gender: formData.gender,
    bg_color: formData.bgColor || '#ffffff',
    note: formData.note,
    favorite: false,
    alt: getAlt(formData)

  };
}