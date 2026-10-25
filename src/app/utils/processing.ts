import { EUROPE, ASIA, AMERICA } from './constants';
import { SortField, SortOrder, SearchField } from './types';

export function getRegion(country: string): string {
    if (EUROPE.includes(country)) return 'Europe';
    if (ASIA.includes(country)) return 'Asia';
    if (AMERICA.includes(country)) return 'America';
    return 'Other';
}

export function filterTeachers(teachers: any[], filters: {
    country: string, age: string,
    region: string, sex: string, onlyPhoto: boolean, onlyFavorites: boolean
}) {
    return teachers.filter(teacher => {
        if (filters.country && filters.country !== '' && filters.country.toLowerCase() !== 'all') {
            if (teacher.country?.toLowerCase() !== filters.country.toLowerCase()) {
                return false;
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

        if (filters.onlyPhoto && (!teacher.picture_large || teacher.picture_large.trim() === '')) {
            return false;
        }

        if (filters.onlyFavorites && !teacher.favorite) {
            return false;
        }

        return true;
    });
}

export function sort(
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

export function find(data: any[], query: string | number, field?: SearchField): any[] {
    if (!data || data.length === 0 || query === undefined || query === null) {
        return [];
    }

    const queryStr = String(query).trim().toLowerCase();

    return data.filter(item => {
        if (field) {
            const val = item[field];
            if (val === undefined || val === null) return false;
            if (typeof val === 'number' || typeof query === 'number') {
                return Number(val) === Number(query);
            }
            return String(val).toLowerCase().includes(queryStr);
        }

        const nameVal = item.full_name || item.name || '';
        const noteVal = item.note || '';
        const ageVal = item.age;

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
    if (!users || users.length === 0) return 0;
    const matchingCount = users.filter(predicate).length;
    const percentage = (matchingCount / users.length) * 100;
    return Number(percentage.toFixed(2));
}