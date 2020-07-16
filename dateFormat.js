import moment from 'moment'

function dateFormat(seconds) {
    return moment(new Date(seconds * 1000)).format('HH:mm, D/MM/YYYY') 
}

function timeFromNow(seconds) {
    let timeString = moment(new Date(seconds * 1000)).fromNow().toString()
    timeString = timeString
        .replace('ago', 'trước')
        .replace('a second', '1 giây')
        .replace('a few', 'vài')
        .replace('a minute', '1 phút')
        .replace('an hour', '1 giờ')
        .replace('a day', '1 ngày')
        .replace('a week', '1 tuần')
        .replace('a month', '1 tháng')
        .replace('a year', '1 năm')
        .replace('seconds', 'giây')
        .replace('minutes', 'phút')
        .replace('hours', 'giờ')
        .replace('days', 'ngày')
        .replace('weeks', 'tuần')
        .replace('months', 'tháng')
        .replace('years', 'năm')
    return timeString
}

export {dateFormat, timeFromNow}