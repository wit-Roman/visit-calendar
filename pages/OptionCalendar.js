import { Component } from 'react'
import dateFns from 'date-fns'
import ruLocale from 'date-fns/locale/ru'

class OptionCalendar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentMonth: new Date(),
      windowWidth: 0,
      windowHeight: 0
    }
    this.onDateClick = this.onDateClick.bind(this)
    this.nextMonth = this.nextMonth.bind(this)
    this.prevMonth = this.prevMonth.bind(this)
    this._cells = []
  }
  componentDidMount() {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    })
  }
  onDateClick(day) {
    const { accessMember, widgetEnable, widgetWeeks, weekDay, period } = this.props
    this.props.blockDay(day, accessMember, widgetEnable, widgetWeeks, weekDay, period)
    document.getElementById("save-button").classList.remove("complete")
  }
  nextMonth() {
    this.setState({ currentMonth: dateFns.addMonths(this.state.currentMonth, 1) })
  }
  prevMonth() {
    this.setState({ currentMonth: dateFns.subMonths(this.state.currentMonth, 1) })
  }
  renderHeader() {
    return (
      <div className="row calendar_header">
        <div className="calendar_header_col-start">
          <div className="calendar_header_icon icon" onClick={this.prevMonth}>chevron_left</div>
        </div>
        <div className="calendar_header_col-center">
          <span>{dateFns.format(this.state.currentMonth, "MMMM YYYY", {locale: ruLocale})}</span>
        </div>
        <div className="calendar_header_col-end">
          <div className="calendar_header_icon icon" onClick={this.nextMonth}>chevron_right</div>
        </div>
      </div>
    )
  }
  renderDays() {
    const days = []
    let startDate = dateFns.startOfWeek(this.state.currentMonth, {weekStartsOn: 1})
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), (this.state.windowWidth>600)?"dddd":"dd", {locale: ruLocale})}
        </div>
      )
    }
    return <div className="row calendar_daysNames">{days}</div>
  }
  renderCells() {
    const { process,weekDay,period,blockedDays,today } = this.props
    const { currentMonth } = this.state
    const monthStart = dateFns.startOfMonth(currentMonth)
    const monthEnd = dateFns.endOfMonth(monthStart)
    const startDate = dateFns.startOfWeek(monthStart, {weekStartsOn: 1})
    const endDate = dateFns.endOfWeek(monthEnd)

    let rows = []
    let days = []
    let day = startDate
    let formattedDate = ""

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, "D", {locale: ruLocale})
        const cloneDay = dateFns.format(day,'YYYY-MM-DD')
        const isToday = (dateFns.isSameDay(day,today))
        days.push(
        <div
          className={`col calendar_body_cell
            ${ (!dateFns.isSameMonth(day, monthStart)) ? "another" : "" }
            ${ (blockedDays.includes(cloneDay)) ? "unselected" : "" }
            ${ (!weekDay[i]) ? "freeday" : "" }
            ${ (dateFns.isBefore(day, dateFns.endOfYesterday(today))) ? "pastday" : "" }
            ${ (dateFns.isBefore(day,period[0]) || dateFns.isAfter(day,period[1]) ) ? "endday" : "" }
          `}
          key={ cloneDay }
          onClick={() => this.onDateClick(cloneDay)}
        >
          <span className={`calendar_body_cell_number ${(isToday)?"today":""}`}>{formattedDate}</span>
        </div>
        )
        day = dateFns.addDays(day, 1)
      }
      rows.push(
        <div className="row" key={dateFns.format(day, 'YYYY-MM-WW')}>{days}</div>
      )
      days = []
    }
    return <div className="calendar_body">{rows}</div>
  }

  render () {
    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
      </div>
    )
  }
}

export default OptionCalendar