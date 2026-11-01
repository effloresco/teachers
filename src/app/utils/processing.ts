import _ from 'lodash';
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
    return _.filter(teachers, teacher => {
        if (!_.isEmpty(filters.country) && _.toLower(filters.country) !== 'all') {
            if (_.toLower(teacher.country) !== _.toLower(filters.country)) {
                return false;
            }
        }

        if (!_.isEmpty(filters.age) && _.toLower(filters.age) !== 'all') {
            const age = teacher.age;
            if (filters.age === '21-30' && (age < 21 || age > 30)) return false;
            if (filters.age === '30-35' && (age < 30 || age > 35)) return false;
            if (filters.age === '35+' && age < 35) return false;
        }

        if (!_.isEmpty(filters.region) && _.toLower(filters.region) !== 'all') {
            const region = getRegion(teacher.country);
            if (region !== filters.region) return false;
        }

        if (!_.isEmpty(filters.sex) && _.toLower(filters.sex) !== 'all') {
            if (!teacher.gender || _.toLower(teacher.gender) !== _.toLower(filters.sex)) return false;
        }

        if (filters.onlyPhoto && _.isEmpty(_.trim(teacher.picture_large))) {
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
    if (_.isEmpty(users) || !field) {
        return users;
    }

    const direction = order === 'desc' ? 'desc' : 'asc';

    const iteratees = (item: any) => {
        let val = item[field];
        if (field === 'b_day' && _.isUndefined(val)) {
            val = item.b_date;
        }

        if ((field === 'b_day' || field === 'b_date') && !_.isNil(val)) {
            const time = new Date(val).getTime();
            return _.isNaN(time) ? val : time;
        }

        return val;
    };

    return _.orderBy(users, [iteratees], [direction]);
}

export function find(data: any[], query: string | number, field?: SearchField): any[] {
    if (_.isEmpty(data) || _.isNil(query)) {
        return [];
    }

    const queryStr = _.toLower(_.trim(String(query)));

    return _.filter(data, item => {
        if (field) {
            const val = item[field];
            if (_.isNil(val)) return false;
            if (_.isNumber(val) || _.isNumber(query)) {
                return _.toNumber(val) === _.toNumber(query);
            }
            return _.includes(_.toLower(String(val)), queryStr);
        }

        const nameVal = item.full_name || item.name || '';
        const noteVal = item.note || '';
        const ageVal = item.age;

        if (_.isNumber(query) || (!_.isNaN(_.toNumber(query)) && !_.isEmpty(queryStr))) {
            if (_.toNumber(ageVal) === _.toNumber(query)) {
                return true;
            }
        }

        const matchesName = _.includes(_.toLower(String(nameVal)), queryStr);
        const matchesNote = _.includes(_.toLower(String(noteVal)), queryStr);

        return matchesName || matchesNote;
    });
}

export function getMatchingPercentage(
    users: any[],
    condition: (user: any) => boolean
): number {
    if (!users || users.length === 0) return 0;
    const matchingCount = users.filter(condition).length;
    const percentage = (matchingCount / users.length) * 100;
    return Number(percentage.toFixed(2));
}