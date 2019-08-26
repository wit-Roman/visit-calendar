import { connect } from 'react-redux'
import { blockDay, changeOption, actionTypes } from './store'
import { Component } from 'react'
import LinkToSettings from './LinkToSettings'
import OptionCalendar from './OptionCalendar'
import dateFns from 'date-fns'

class Settings extends Component {
    constructor(props) {
        super(props)
        this.state={
            selectedDates: props.selectedDates,
            accessMember: props.accessMember,
            widgetEnable: props.widgetEnable,
            widgetWeeks: props.widgetWeeks,
            widgetToken: "",
            autoUpd: props.autoUpd,
            allowedDays1: props.weekDay[0],
            allowedDays2: props.weekDay[1],
            allowedDays3: props.weekDay[2],
            allowedDays4: props.weekDay[3],
            allowedDays5: props.weekDay[4],
            allowedDays6: props.weekDay[5],
            allowedDays7: props.weekDay[6],
            allowedDaysMin: props.period[0],
            allowedDaysMax: props.period[1],
            blockedDays: props.blockedDays,
            parentUrl: "",
            group_id: props.group_id,
            mount: false
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handlePermission = this.handlePermission.bind(this)
        this.handleAddWidget = this.handleAddWidget.bind(this)
    }
    componentDidMount() {
        this.props.changeOption('/setting?g='+this.props.group_id,actionTypes.OPTION)
        const vkScriptReady = this.vkScriptReady.bind(this)
        const script = document.createElement("script")
        script.src = "https://vk.com/js/api/xd_connection.js?2"
        script.async = true
        script.onload = () => {
            VK.init(function() {
                vkScriptReady()
            }, function() {
                console.error('VK init error', arguments)
            }, '5.74');
        }

        document.body.appendChild(script);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            selectedDates: nextProps.selectedDates,
            accessMember: nextProps.accessMember,
            widgetEnable: nextProps.widgetEnable,
            widgetWeeks: nextProps.widgetWeeks,
            autoUpd: nextProps.autoUpd,
            allowedDays1: nextProps.weekDay[0],
            allowedDays2: nextProps.weekDay[1],
            allowedDays3: nextProps.weekDay[2],
            allowedDays4: nextProps.weekDay[3],
            allowedDays5: nextProps.weekDay[4],
            allowedDays6: nextProps.weekDay[5],
            allowedDays7: nextProps.weekDay[6],
            allowedDaysMin: nextProps.period[0],
            allowedDaysMax: nextProps.period[1],
            blockedDays: nextProps.blockedDays,
            parentUrl: nextProps.parentUrl,
            group_id: nextProps.group_id,
            mount: true
        })
    }
    handleInputChange(e) {
        const name = e.target.name
        let value = e.target.value
        if ( e.target.type === "checkbox" )
            value = (e.target.checked) ? true : false;
        document.getElementById("save-button").classList.remove("complete")
        this.setState({ [name]: value })
    }
    handleSubmit(e) {
        e.preventDefault()
        const _obj = Object.assign({}, this.state, { blockedDays: this.props.blockedDays })
        this.props.changeOption('/setting',actionTypes.OPTION,"POST",_obj)
        setTimeout( () => {
            this.props.changeOption('/setting',actionTypes.OPTION) }, 3000 )
        document.getElementById("save-button").classList.add("complete")
    }
    handlePermission() {
        VK.callMethod("showGroupSettingsBox", 64)
    }
    handleAddWidget() {
        const { today, parentUrl, selectedDates } = this.props
        const { widgetWeeks } = this.state
        const startDate = dateFns.startOfWeek(today, {weekStartsOn: 6})
        const monthEnd = dateFns.endOfMonth(today)
        const periodEnd = dateFns.addWeeks(startDate, widgetWeeks)
        const endDate = dateFns.endOfWeek(periodEnd)
        const difference = dateFns.differenceInDays(startDate,endDate)
        const group_id = ( !parentUrl.includes('_-') )
            ? ( !parentUrl.includes('public') )
                ? (!document.referrer.includes('_-'))
                    ? (!document.referrer.includes('public'))
                        ? ''
                    : document.referrer.split('public')[1]
                : document.referrer.split('_-')[1]
            : parentUrl.split('public')[1]
        : parentUrl.split('_-')[1] ;
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
            "more_url": "https://vk.com/club'+group_id+'?w=app6841218_-'+group_id+'", \
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
        VK.callMethod("showAppWidgetPreviewBox", "table", code);
    }
    vkScriptReady() {
        const callback = (event, className, e) => {
			showAlert(className, event, e)
        }
        const setVkCallback = ( event, className) => {
			VK.addCallback(event, callback.bind(null, event, className));
        }
        const showAlert = (className, header, text) => {
            if (className === 'allowed')
                this.setState({widgetEnable: 1})
            if (className === 'success')
                this.setState({widgetEnable: 2})
        }
        setVkCallback('onAppWidgetPreviewFail', 'warning')
        setVkCallback('onAppWidgetPreviewCancel', 'info')
        setVkCallback('onAppWidgetPreviewSuccess', 'success')
        setVkCallback('onGroupSettingsChanged', 'allowed' )
    }
    render () {
        const {process,blockDay,blockedDays,today} = this.props
        const {accessMember,widgetEnable,widgetWeeks,autoUpd,allowedDays1,allowedDays2,allowedDays3,allowedDays4,allowedDays5,allowedDays6,allowedDays7,allowedDaysMin,allowedDaysMax} = this.state
        return (
            <div>
                <form method="post" name="formSetting" className="setting_form" onSubmit={this.handleSubmit} >
                    <div className="">
                        <div className="setting_text">Время сервера: <span>{today} +3</span></div>
                        <div className="save-button-wrap">
                            <input id="save-button" className="standart-button save-button complete" type="submit" value="Сохранить настройки" />
                        </div>
                    </div>
                    <div>
                        <div className="setting_text">
                            <label htmlFor="accessMember">Разрешить запись только участникам сообщества &nbsp;{ accessMember ? 'Вкл' : 'Выкл' }</label>
                            <input name="accessMember" type="checkbox" checked={accessMember} onChange={this.handleInputChange} />
                        </div>
                        <div className="setting_title">Настройки виджета группы</div>
                        <div className="setting_text">Состояние: {(widgetEnable===2 && !autoUpd) ? 'Виджет размещен, но не обновляется.': (autoUpd) ? 'Виджет включен и обновляется. Ключ активен.' : (widgetEnable===1) ? 'Виджет был разрешен, но не был размещен.' : 'Виджет отключен.' }</div>
                        <div>
                            <div className="setting_text">
                                <input className="standart-button" type="button" value="Разрешить виджеты" onClick={this.handlePermission} />&nbsp;
                                <input className="standart-button" type="button" value="Разместить виджет" onClick={this.handleAddWidget} />&nbsp;
                                <label htmlFor="widgetWeeks">Количество недель:&nbsp;</label>
                                <input className="standart-input" name="widgetWeeks" type="number" value={widgetWeeks} onChange={this.handleInputChange} min="1" max="9" required />
                            </div>
                            <div className="setting_text">
                                <label htmlFor="widgetToken">Чтобы разрешить автообновление введите ключ:&nbsp;<input className="standart-input" name="widgetToken" type="text" onChange={this.handleInputChange} placeholder="Ключ доступа" maxLength="120" />
                                &nbsp;<span className="setting_quest_1">
                                    <i className="material-icons">contact_support</i>
                                </span>
                                &nbsp;<span className="setting_quest_2">
                                    <i className="material-icons">contact_support</i>
                                </span>
                                <span className="setting_answer_1">Группа->Управление->Настройки->Работа с API->Ключ доступа для виджета приложения сообщества</span>
                                <span className="setting_answer_2">Изменить видимость виджета: Группа->Управление->Настройки->Приложения->Видимость виджета приложения</span>
                                </label> 
                            </div>
                            <div className="setting_text">
                                <label htmlFor="autoUpd">Автообновление данных виджета календаря каждые 5 мин &nbsp;{ autoUpd ? 'Вкл' : 'Выкл' }</label>
                                <input name="autoUpd" type="checkbox" checked={autoUpd} disabled />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="setting_title">Ограничения по дням</div>
                        <div className="row">
                            <div className="setting_text">Рабочие дни по дням недели:&nbsp;</div>
                            <table>
                                <thead>
                                <tr>
                                    <th>ПН</th>
                                    <th>ВТ</th>
                                    <th>СР</th>
                                    <th>ЧТ</th>
                                    <th>ПТ</th>
                                    <th>СБ</th>
                                    <th>ВС</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>
                                        <input name="allowedDays1" checked={allowedDays1} type="checkbox" onChange={this.handleInputChange} />
                                    </td>
                                    <td>
                                        <input name="allowedDays2" checked={allowedDays2} type="checkbox" onChange={this.handleInputChange} />
                                    </td>
                                    <td>
                                        <input name="allowedDays3" checked={allowedDays3} type="checkbox" onChange={this.handleInputChange} />
                                    </td>
                                    <td>
                                        <input name="allowedDays4" checked={allowedDays4} type="checkbox" onChange={this.handleInputChange} />
                                    </td>
                                    <td>
                                        <input name="allowedDays5" checked={allowedDays5} type="checkbox" onChange={this.handleInputChange} />
                                    </td>
                                    <td>
                                        <input name="allowedDays6" checked={allowedDays6} type="checkbox" onChange={this.handleInputChange} />
                                    </td>
                                    <td>
                                        <input name="allowedDays7" checked={allowedDays7} type="checkbox" onChange={this.handleInputChange} />
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="row setting_text">
                            <div className="">Задать временной промежуток:&nbsp;</div>
                            &nbsp;<input className="standart-input" name="allowedDaysMin" type="date" value={allowedDaysMin} onChange={this.handleInputChange} />
                            &nbsp;<input className="standart-input" name="allowedDaysMax" type="date" value={allowedDaysMax} onChange={this.handleInputChange} />
                        </div>
                    </div>
                    <div>
                        <div className="setting_text">Добавить нерабочие дни вручную:</div>
                        { (this.state.mount)&& <OptionCalendar
                            process={process}
                            today={today}
                            accessMember={accessMember}
                            widgetEnable={widgetEnable}
                            widgetWeeks={widgetWeeks}
                            weekDay={[allowedDays1,allowedDays2,allowedDays3,allowedDays4,allowedDays5,allowedDays6,allowedDays7]}
                            period={[allowedDaysMin,allowedDaysMax]}
                            blockedDays={blockedDays}
                            blockDay={blockDay} /> }
                    </div>
                </form>
            </div>
        )
    }
}

function AppWrapper({ selectedDates, accessMember, widgetEnable, widgetWeeks, autoUpd, rights, process, group_id, today, parentUrl, weekDay, period, blockedDays, changeOption, blockDay }) {
    return (
      <div className="setting_wrap">
        <LinkToSettings rights={4} url='/' as='/index' name='&#8592; Календарь' />
        <Settings
          selectedDates={selectedDates}
          accessMember={accessMember}
          widgetEnable={widgetEnable}
          widgetWeeks={widgetWeeks}
          autoUpd={autoUpd}
          rights={rights}
          process={process}
          group_id={group_id}
          today={today}
          parentUrl={parentUrl}
          weekDay={weekDay}
          period={period}
          blockedDays={blockedDays}
          changeOption={changeOption}
          blockDay={blockDay} />
      </div>
    )
}

const mapStateToProps = state => {
    const { rights, process, group_id, today, parentUrl, selectedDates, accessMember, widgetEnable, widgetWeeks, autoUpd, weekDay, period, blockedDays } = state
    return { rights, process, group_id, today, parentUrl, selectedDates, accessMember, widgetEnable, widgetWeeks, autoUpd, weekDay, period, blockedDays }
}

const mapDispatchToProps = dispatch => {
    return {
        blockDay: (day, accessMember, widgetEnable, widgetWeeks, weekDay, period) => dispatch(blockDay(day, accessMember, widgetEnable, widgetWeeks, weekDay, period)),
        changeOption: (url,type,method,body) => dispatch(changeOption(url,type,method,body))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AppWrapper)