import { connect } from 'react-redux'
import { itemsFetchData, actionTypes } from './store'
import LinkToSettings from './LinkToSettings'
import Calendar from './Calendar'

function AppWrapper({ selectedDates, sessions, selectedUserDates, lastChanged, accessMember, rights, process, group_id, viewer_id, weekDay, period, blockedDays, today, fetchData, startConnect }) {
  return (
    <div>
      <LinkToSettings rights={rights} url='/settings' as='/settings' name='Настройки' />
      <Calendar
        selectedDates={selectedDates}
        sessions={sessions}
        selectedUserDates={selectedUserDates}
        lastChanged={lastChanged}
        accessMember={accessMember}
        rights={rights}
        process={process}
        group_id={group_id}
        viewer_id={viewer_id}
        weekDay={weekDay}
        period={period}
        blockedDays={blockedDays}
        today={today}
        fetchData={fetchData}
        startConnect={startConnect} />
    </div>
  )
}

const mapStateToProps = state => {
  const { selectedDates, sessions, selectedUserDates, lastChanged, accessMember, rights, process, group_id, viewer_id, weekDay, period, blockedDays, today } = state
  return { selectedDates, sessions, selectedUserDates, lastChanged, accessMember, rights, process, group_id, viewer_id, weekDay, period, blockedDays, today }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchData: (url) => dispatch(itemsFetchData(url,actionTypes.CHNG)),
    startConnect: (url) => dispatch(itemsFetchData(url,actionTypes.UPD))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(AppWrapper)