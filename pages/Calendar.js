import { Component } from 'react'
import dateFns from 'date-fns'
import ruLocale from 'date-fns/locale/ru'

class Calendar extends Component {
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
  }
  componentDidMount() {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    })
    const {group_id, viewer_id} = this.props
    this.props.startConnect('/val?l=0&g='+group_id+'&v='+viewer_id)
    this.timer = setInterval(() => {
      const { lastChanged } = this.props
      this.props.startConnect('/val?l='+lastChanged+'&g='+group_id+'&v='+viewer_id)
    }, 5000)
  }
  componentWillUnmount () {
    clearInterval(this.timer)
  }
  onDateClick(day,classes) {
    const {accessMember,rights,group_id,viewer_id} = this.props
    if(accessMember && rights < 1) {
      alert("Только участники сообщества могут записаться")
      return false
    }
    if (classes.contains("innactive") || !(classes.contains("calendar_body_cell_control") || classes.contains("calendar_body_cell_icon")) ) {
      return false
    } else {
      this.props.fetchData('/change?d='+day+'&g='+group_id+'&v='+viewer_id)
    }
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
  renderUsers(cloneDay) {
    const { selectedDates,sessions } = this.props
    let result = []
    Object.entries(selectedDates).forEach(user=> {
      user[1].forEach(date=> {
        if (cloneDay === date) {
          if (typeof sessions[user[0]] === "undefined") return;
          const profile = sessions[user[0]]
          result.push(
            <div key={user[0]} className="calendar_body_cell_item">
              <a href={"https://vk.com/id"+profile.viewer_id} target="_blank" className="calendar_body_cell_avatar" title={profile.first_name+" "+profile.last_name} >
                <img className="calendar_body_cell_avatar_img" src={profile.photo_50} alt={profile.first_name+" "+profile.last_name} />
              </a>
            </div>
          )
        }
      })
    })
    return result
  }
  renderCells() {
    const { selectedUserDates, process, weekDay, period, blockedDays, today } = this.props
    const { currentMonth } = this.state
    const monthStart = dateFns.startOfMonth(currentMonth)
    const monthEnd = dateFns.endOfMonth(monthStart)
    const startDate = dateFns.startOfWeek(monthStart, {weekStartsOn: 1})
    const endDate = dateFns.endOfWeek(monthEnd)
    let rows = []
    let day = startDate
    while (day <= endDate) {
      let days = []
      for (let i = 0; i < 7; i++) {
        const cloneDay = dateFns.format(day,'YYYY-MM-DD')
        const users = this.renderUsers(cloneDay)
        const dayIsIncludes = selectedUserDates.includes(cloneDay)
        const innactive = ( blockedDays.includes(cloneDay) || !weekDay[i] || dateFns.isBefore(day, dateFns.endOfYesterday(today)) || dateFns.isBefore(day,period[0]) || dateFns.isAfter(day,period[1]) )
        const isToday = (dateFns.isSameDay(day,today))
        days.push(
        <div className={`col calendar_body_cell ${(!dateFns.isSameMonth(day, monthStart)) ? "another" : ""} ${(dayIsIncludes) ? "selected" : ""} ${(innactive) ? "unselected" : ""} `}
          key={cloneDay}
        >
          <div className={`row calendar_body_cell_control ${(innactive)?"innactive":""}`} onClick={(e) => this.onDateClick(cloneDay,e.target.classList)}>
            <span className={`calendar_body_cell_icon icon ${(innactive)?"innactive":(dayIsIncludes)?"red":"green"}`}>
              {(dayIsIncludes)?"indeterminate_check_box":"add_box"}
            </span>
            <span className="calendar_body_cell_count">{(users.length>0)?users.length:" "}</span>
            <span className={`calendar_body_cell_number ${(isToday)?"today":""}`}>{dateFns.format(day, "D", {locale: ruLocale})}</span>
          </div>
          <div className="calendar_body_cell_users_wrap">
            <div className="calendar_body_cell_users">
              {users}
            </div>
          </div>
        </div>
        )
        day = dateFns.addDays(day, 1)
      }
      rows.push(
        <div className="row" key={dateFns.format(day, 'YYYY-MM-WW')}>{days}</div>
      )
    }
    return <div className="calendar_body main">{rows}</div>
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

export default Calendar