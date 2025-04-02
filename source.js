function parseDate(args) {
    args = args.replace(/["«»]/g, '').trim().toLowerCase();

    const regexPatterns = [
        /(\d{2})[-.](\d{2})[-.](\d{4})\s+года\s+(\d{2}):(\d{2})\s+часов/, //паттерн формата ДД-ММ-ГГГГ со временем
        /(\d{4})[-.](\d{2})[-.](\d{2})\s+года\s+в\s+(\d{2}):(\d{2})/, //паттерн формата ГГГГ-ММ-ДД со временем
        /(\d{2})[-.](\d{2})[-.](\d{4})\s+год/, //паттерн формата ДД-ММ-ГГГГ
        /(\d{4})[-.](\d{2})[-.](\d{2})\s+год/, //паттерн формата ГГГГ-ММ-17
        /(\d{1,2})\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s+(\d{4})\s+год/, //паттерн формата ДД Месяц ГГГГ год
        /(\d{1,2})\s+(янв|фев|мар|апр|мая|июн|июл|авг|сен|окт|ноя|дек)\.\s+(\d{4})\s+год/, //паттерн формата ДД Мес ГГГГ год
        /(\d{2})\/(\d{2})\/(\d{4})\s+г\.\s+в\s+(\d{2}):(\d{2})/ //паттерн формата ДД/ММ/ГГГГ со временем
    ];

    let match;
    for (const regex of regexPatterns) {
        match = args.match(regex);
        if (match) break;
    }

    if (!match) {
        throw new Error("Не верный формат даты или паттерн");
    }

    let year, month, day, hours = "00", minutes = "00";

    if (regexPatterns[1].test(args) || regexPatterns[3].test(args)) {
        [year, month, day] = [match[1], match[2], match[3]];
    } else if (regexPatterns[0].test(args) || regexPatterns[2].test(args) || regexPatterns[6].test(args)) {
        [day, month, year] = [match[1], match[2], match[3]];
    } else {
        [day, month, year] = [match[1], match[2], match[3]];
        month = getMonthNumber(month);
    }

    if (match[4] && match[5]) {
        [hours, minutes] = [match[4], match[5]];
    }

    return `${year}-${padZero(month)}-${padZero(day)}T${padZero(hours)}:${padZero(minutes)}:00.000Z`;

    function padZero(value) {
        return value.toString().padStart(2, "0");
    }

    function getMonthNumber(monthName) {
        const months = {
            янв: "01", фев: "02", мар: "03", апр: "04", мая: "05", июн: "06",
            июл: "07", авг: "08", сен: "09", окт: "10", ноя: "11", дек: "12",
            января: "01", февраля: "02", марта: "03", апреля: "04", мая: "05", июня: "06",
            июля: "07", августа: "08", сентября: "09", октября: "10", ноября: "11", декабря: "12"
        };
        return months[monthName];
    }
}

function toISOFormat(args) {
    const {src, options} = args;
    const dateString = src[options]
    const regex = /^(\d{4}-\d{2}-\d{2})(T\d{2}:\d{2}:\d{2}(\.\d{3})?)?([+-]\d{2}:\d{2}|Z)?$/; //Паттерн ГГГГ-ММ-ДДT:чч:мм:сс.мсмсмсZ

    const match = dateString.match(regex);
    if (match) {


        const [_, datePart, timePart, milliseconds, timezone] = match;
        if (timezone) {
            if (!timePart) {
                return `${datePart}T00:00:00.000${timezone}`;
            }
            return dateString;
        }

        if (timePart) {
            const hasMilliseconds = !!milliseconds;
            return `${datePart}${timePart}${hasMilliseconds ? '' : '.000'}Z`;
        }

        return `${datePart}T00:00:00.000Z`;
    }
    return parseDate(dateString)
}


module.exports = toISOFormat