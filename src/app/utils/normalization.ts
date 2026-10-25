import { COURSES } from './constants';

export function getRandomCourse(): string {
  const index = Math.floor(Math.random() * COURSES.length);
  return COURSES[index];
}

export function getAlt(teacher: any): string {
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

export function transformUsers(randomUsers: any[]): any[] {
  const uniqueMap = new Map();

  for (const item of randomUsers) {
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
      id: typeof (item.id) === 'string' && item.id || item.login?.uuid || crypto.randomUUID(),
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

  return {
    id: crypto.randomUUID(),
    full_name: formData.full_name,
    firstName,
    lastName,
    course: formData.course,
    country: formData.country,
    city: formData.city,
    email: formData.email,
    phone: formData.phone,
    b_date: formData.dob,
    age,
    gender: formData.gender,
    bg_color: formData.bgColor || '#ffffff',
    note: formData.note,
    favorite: false,
    alt: getAlt(formData)
  };
}