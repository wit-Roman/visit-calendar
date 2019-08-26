import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import fetch from 'cross-fetch'
import thunkMiddleware from 'redux-thunk'

const exampleInitialState = {
  group_id: 0,
  viewer_id: 0,
  selectedDates: {},
  sessions: {},
  selectedUserDates: [],
  lastChanged: 0,
  rights: 0,
  process: true,
  accessMember: false,
  widgetEnable: 0,
  widgetWeeks: 4,
  autoUpd: false,
  weekDay: [true,true,true,true,true,true,true],
  period: [new Date().getFullYear()+"-01-01",(new Date().getFullYear()+1)+"-12-31"],
  blockedDays: [],
  today: new Date().toUTCString(),
  parentUrl: (typeof document === "undefined")? '' : document.referrer
}
export const actionTypes = {
  LOAD: 'LOAD',
  UPD: 'UPD',
  CHNG: 'CHNG',
  OPTION: 'OPTION',
  BLOCK: 'BLOCK'
}
// REDUCERS
export const reducer = (state = exampleInitialState, action) => {
  switch (action.type) {
    case actionTypes.LOAD:
      return Object.assign({}, state, {
        process: action.process,
        group_id: action.group_id,
        viewer_id: action.viewer_id
      })
    case actionTypes.UPD:
      return Object.assign({}, state, {
        selectedDates: action.val.selectedDates,
        sessions: action.val.sessions,
        selectedUserDates: action.val.selectedUserDates,
        lastChanged: action.val.lastChanged,
        accessMember: action.val.accessMember,
        rights: action.val.rights,
        process: false,
        weekDay: action.val.weekDay,
        period: action.val.period,
        blockedDays: action.val.blockedDays,
        today: new Date(action.val.today).toUTCString(),
      })
    case actionTypes.CHNG:
      return Object.assign({}, state, {
        selectedDates: action.val.selectedDates,
        sessions: action.val.sessions,
        selectedUserDates: action.val.selectedUserDates,
        lastChanged: action.val.lastChanged,
        accessMember: action.val.accessMember,
        rights: action.val.rights,
        process: false
      })
    case actionTypes.OPTION:
      return Object.assign({}, state, {
        selectedDates: action.val.selectedDates,
        accessMember: action.val.accessMember,
        widgetEnable: action.val.widgetEnable,
        widgetWeeks: action.val.widgetWeeks,
        weekDay: action.val.weekDay,
        period: action.val.period,
        blockedDays: action.val.blockedDays,
        autoUpd: action.val.autoUpd,
        process: false,
        today: new Date(action.val.today).toUTCString(),
        parentUrl: (typeof document === "undefined")? '' : document.referrer
      })
    case actionTypes.BLOCK:
      let copyBlockDay = [ ...state.blockedDays ]
      const index = copyBlockDay.indexOf(action.day)
      if ( index === -1 ) {
        copyBlockDay.push(action.day)
      } else {
        copyBlockDay.splice(index,1)
      }
      return Object.assign({}, state, {
        accessMember: action.accessMember,
        widgetEnable: action.widgetEnable,
        widgetWeeks: action.widgetWeeks,
        weekDay: action.weekDay,
        period: action.period,
        blockedDays: copyBlockDay
      })
    default:
      return state
  }
}
// XHR Middleware
function ajaxWrapper(dispatch,url,type,method="GET",body={}) {
  //dispatch({ type: actionTypes.LOAD })
  //console.log(url)
  let xhrOption = {
    method,
    headers: {'Content-Type': 'application/json'}
  }
  if ( method === "POST" ) xhrOption.body = JSON.stringify(body);
  fetch(url,xhrOption)
    .then((response) => {
      if ( url === '/setting' && method === "POST" )
        alert( (response.ok) ? "Настройки успешно сохранены" : "Ошибка ввода, настройки не сохранены: "+response.status+response.statusText );
      if (!response.ok) throw Error(response.statusText);
      return response.json()
    }).then((val) => {
      if ( val.lastChanged === false ) return;
      dispatch({ type, val })
    })
    .catch((err) => console.log(err) )
} 
// ACTIONS
export const serverRender = (isServer,group_id,viewer_id) => dispatch =>
  dispatch({ type: actionTypes.LOAD, process: !isServer, group_id, viewer_id })

export const itemsFetchData = (url,type) => dispatch =>
  ajaxWrapper(dispatch, url, type)

export const changeOption = (url,type,method,body) => dispatch =>
  ajaxWrapper(dispatch, url, type, method, body)

export const blockDay = (day, accessMember, widgetEnable, widgetWeeks, weekDay, period ) => dispatch =>
  dispatch({ type: actionTypes.BLOCK, day, accessMember, widgetEnable, widgetWeeks, weekDay, period })

// Store config
export function initializeStore (initialState = exampleInitialState) {
  return createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  )
}