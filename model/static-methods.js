exports.SQLoperation = function (SQLquery) {
    return new Promise((resolve, reject) => {
        const mysql = require('mysql');
        const mysqlConn = mysql.createConnection({
            host: "localhost",
            user: "wit",
            password: "rerevfhbzdb",
            database : "cal"
        });
        mysqlConn.connect();
        mysqlConn.query(SQLquery, (error,rows) => {
            if (error) {
                reject(error);
                throw error;
            } 
            resolve(rows);
        });
    
        mysqlConn.end();
    })
}
const validateDate = exports.validateDate = function (string) {
    //const re = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
    const re = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])?$/
    return re.test(string)
}
exports.transformIntToISO = function (val=0) {
    const dateFns = require('date-fns');
    const dateObj = new Date(val);
    return dateFns.format( dateObj, 'YYYY-MM-DD')
}
exports.validateSession = function (query) {
    if ( !query.hasOwnProperty('api_result') ||
    isNaN(query.api_id) ||
    isNaN(query.api_settings) ||
    isNaN(query.viewer_id) ||
    isNaN(query.viewer_type) ||
    isNaN(query.user_id) ||
    isNaN(query.group_id) )
        return false;
    const api_result = JSON.parse(query.api_result)
    if ( !(
    api_result.hasOwnProperty("response") &&
    api_result.response[0].first_name.length > 1 &&
    api_result.response[0].first_name.length < 64 &&
    api_result.response[0].last_name.length > 1 &&
    api_result.response[0].last_name.length < 64 &&
    api_result.response[0].photo_50.length < 128 ) )
        return false;
    return true
}
exports.validateSettings = function (body,group_id) {
    if ( !(
    body.hasOwnProperty('accessMember') &&
    body.hasOwnProperty('widgetEnable') &&
    body.hasOwnProperty('widgetWeeks') &&
    body.hasOwnProperty('widgetToken') &&
    body.hasOwnProperty('allowedDays1') &&
    body.hasOwnProperty('allowedDays2') &&
    body.hasOwnProperty('allowedDays3') &&
    body.hasOwnProperty('allowedDays4') &&
    body.hasOwnProperty('allowedDays5') &&
    body.hasOwnProperty('allowedDays6') &&
    body.hasOwnProperty('allowedDays7') &&
    body.hasOwnProperty('allowedDaysMin') &&
    body.hasOwnProperty('allowedDaysMax') &&
    body.hasOwnProperty('blockedDays')) )
        return false;
    if ( !(
    typeof body.widgetEnable === "number" &&
    !isNaN(body.widgetWeeks) &&
    parseInt(body.widgetWeeks) < 10 &&
    parseInt(body.widgetWeeks) > 1 &&
    typeof body.widgetToken === "string" &&
    body.widgetToken.length < 120 &&
    typeof body.accessMember === "boolean" &&
    typeof body.allowedDays1 === "boolean" &&
    typeof body.allowedDays2 === "boolean" &&
    typeof body.allowedDays3 === "boolean" &&
    typeof body.allowedDays4 === "boolean" &&
    typeof body.allowedDays5 === "boolean" &&
    typeof body.allowedDays6 === "boolean" &&
    typeof body.allowedDays7 === "boolean" &&
    validateDate(body.allowedDaysMin) &&
    validateDate(body.allowedDaysMax) &&
    Array.isArray(body.blockedDays) &&
    !isNaN(group_id)) )
        return false;

    return true;
}
exports.optionsToObj = function (options) {
    let _objSetting = {
        weekDay: [],
        period: [],
        blockedDays: []
    }
    Object.entries(options).forEach(el => {
        const option_name = el[0];
        const option_value = el[1];
        switch (option_name) {
            case ('accessMember') :
                _objSetting[option_name] = (option_value==="1")?true:false
                break;
            case ('widgetWeeks') :
                _objSetting[option_name] = parseInt(option_value)
                break;
            case ('widgetToken') :
                _objSetting[option_name] = (option_value.length > 80 && option_value.length < 100)? option_value : ''
                break;
            case ('autoUpd') :
                _objSetting[option_name] = (option_value=="1")?true:false
                break;
            case ('widgetEnable') :
                _objSetting[option_name] = parseInt(option_value)
                break;
            case ('allowedDays1'):
                _objSetting.weekDay[0] = (option_value=="1")?true:false
                break;
            case ('allowedDays2'):
                _objSetting.weekDay[1] = (option_value=="1")?true:false
                break;
            case ('allowedDays3'):
                _objSetting.weekDay[2] = (option_value=="1")?true:false
                break;
            case ('allowedDays4'):
                _objSetting.weekDay[3] = (option_value=="1")?true:false
                break;
            case ('allowedDays5'):
                _objSetting.weekDay[4] = (option_value=="1")?true:false
                break;
            case ('allowedDays6'):
                _objSetting.weekDay[5] = (option_value=="1")?true:false
                break;
            case ('allowedDays7'):
                _objSetting.weekDay[6] = (option_value=="1")?true:false
                break;
            case ('allowedDaysMin'):
                _objSetting.period[0] = option_value
                break;
            case ('allowedDaysMax'):
                _objSetting.period[1] = option_value
                break;
            case ('blockedDays'):
                _objSetting.blockedDays = (Array.isArray(option_value))?option_value:[]
                break;
        }
    })
    return _objSetting
}
exports.issetOptions = function (options) {
    return (
        options.hasOwnProperty( 'accessMember' ) &&
        options.hasOwnProperty( 'widgetEnable' ) && 
        options.hasOwnProperty( 'widgetWeeks' ) && 
        options.hasOwnProperty( 'weekDay' ) && 
        options.hasOwnProperty( 'period' ) && 
        options.hasOwnProperty( 'blockedDays' ) &&
        options.hasOwnProperty( 'autoUpd' )
    )
}
exports.timezoneFix = function () {
    let d = new Date()
    const nt = d.getUTCHours() + 3
    d.setUTCHours( nt )
    return d.getTime()
}
exports.construct_widget = function (group_id,selectedDates,widgetWeeks,today) {
    const dateFns = require('date-fns')
    const startDate = dateFns.startOfWeek(today, {weekStartsOn: 6})
    //const monthEnd = dateFns.endOfMonth(today)
    const periodEnd = dateFns.addWeeks(startDate, widgetWeeks)
    const endDate = dateFns.endOfWeek(periodEnd)
    const difference = dateFns.differenceInDays(startDate,endDate)
    const startDateformated = dateFns.format(startDate,"DD.MM.YYYY")
    const endDateformated = dateFns.format(endDate,"DD.MM.YYYY")
    var day = startDate
    const num_count = () => {
        const n = dateFns.getDate(day)
        const d = dateFns.format(day,'YYYY-MM-DD')
        let c = 0
        Object.values(selectedDates).forEach(el=>{
            if ( el.includes(d) ) c++;
        })
        day = dateFns.addDays(day, 1)
        return n + " | " + c
    }
    let body = ''
    for (let i=0;i<widgetWeeks;i++) {
        body += '[{ \
            "text": "'+num_count()+' . . . . . . . . . . . '+num_count()+'", \
        }, \
        { \
            "text": "'+num_count()+'", \
        }, \
        { \
            "text": "'+num_count()+'", \
        }, \
        { \
            "text": "'+num_count()+'", \
        }, \
        { \
            "text": "'+num_count()+'", \
        }, \
        { \
            "text": "'+num_count()+'", \
        }, \
        ], \
        '
    }
    const code = 'return { \
        "title": "Календарь посещений на '+startDateformated+' - '+endDateformated+'", \
        "title_counter": '+difference+', \
        "more": "Открыть в приложении ", \
        "more_url": "https://vk.com/public'+group_id+'?w=app6841218_-'+group_id+'", \
        "head": [ \
            { \
                "text": "СБ . . . . . . . . . . . . ВС", \
            }, { \
                "text": "ПН", \
            }, { \
                "text": "ВТ", \
            }, { \
                "text": "СР", \
            }, { \
                "text": "ЧТ", \
            }, { \
                "text": "ПТ", \
            }, \
        ], \
        "body": [ \
            '+body+'\
        ] \
    };'
    return code
}