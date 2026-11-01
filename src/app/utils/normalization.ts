import _ from 'lodash';
import { COURSES } from './constants';

export function getRandomCourse(): string {
    return _.sample(COURSES) || '';
}

export function getAlt(teacher: any): string {
    if (teacher?.alt) {
        return teacher.alt;
    }

    const firstChar = _.toUpper(teacher.name?.first?.[0]);
    const lastChar = _.toUpper(teacher.name?.last?.[0]);

    if (firstChar && lastChar) {
        return `${firstChar}. ${lastChar}.`;
    }

    const fullName = _.trim(_.get(teacher, 'full_name'));
    if (!_.isEmpty(fullName)) {
        const names = _.words(fullName);
        const firstInitial = _.toUpper(_.get(names, '[0][0]'));
        const secondInitial = _.toUpper(_.get(names, '[1][0]'));

        if (_.size(names) >= 2 && firstInitial && secondInitial) {
            return `${firstInitial}. ${secondInitial}.`;
        }
        if (_.size(names) === 1 && firstInitial) {
            return `${firstInitial}.`;
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
    const parts = _.words(_.trim(fullName));
    return {
        firstName: _.first(parts) || '',
        lastName: _.join(_.tail(parts), ' ') || ''
    };
}

export function transformUsers(randomUsers: any[]): any[] {

 const formattedUsers = randomUsers.map(item => ({
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
  
  }));

  return _.uniqBy(formattedUsers, 'id');
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