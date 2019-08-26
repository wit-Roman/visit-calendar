const request = require('request')

exports.waitRequest = async function(url) {
    return await sendRequest(url)
}

function sendRequest(url) {
    return new Promise( (resolve,reject) => {
        request.get(url, (err, response, body) => {
            if(err) reject(new Error(err))
            resolve( JSON.parse(body) )
        })
    })
}
  /*if ( req.query.hasOwnProperty("viewer_type") &&
    req.query.hasOwnProperty("is_app_user") &&
    req.query.hasOwnProperty("is_secure") &&
    req.query.hasOwnProperty("api_result") &&
    req.query.api_result.hasOwnProperty("response") &&
    JSON.parse(req.query.api_result).response[0].can_access_closed ) {
      res.redirect(301, '/settings/');
    }*/
  //console.log('/settings'+req.originalUrl)
  //res.redirect(301, '/settings'+req.originalUrl+'#phrase');
//api_settings: req.query.api_settings,
//sid: req.query.sid,
//secret: req.query.secret,
//access_token: req.query.access_token,
//user_id: req.query.user_id,
//is_app_user: req.query.is_app_user,
//auth_key: req.query.auth_key,
//referrer: req.query.referrer,
//id: response.id,
//is_closed: response.is_closed,
//if ( typeof req.query.api_result == "object" )
      //method=getProfiles&uids={viewer_id}&user_id={user_id}&group_id={group_id}&format=json&v=5.92
      //method=users.get&user_ids={viewer_id}&user_id={user_id}&group_id={group_id}&format=json&fields=photo_200&v=5.92
/*
sendRouter.get('/vkstorageset', (req, res) => {
  req.accepts('application/json');

  if (isNaN(req.query.selectedUserDates)) return res.status(404).send("Not Found");
  
  const url = 'https://api.vk.com/method/storage.set?user_ids=33198675&key=userdates&value='+req.query.selectedUserDates+'&access_token=881ff904881ff904881ff9040688779a868881f881ff904d44d2e32db3a8e46303be4be&v=5.92';

  waitRequest(url).then( result => {
    return res.status(200).send( result )
  }).catch(error => {
    console.dir(error)
    return res.status(404).send("Not Found")
  })
})

sendRouter.get('/vkstorageget', (req, res) => {
  req.accepts('application/json');
  const url = 'https://api.vk.com/method/storage.get?user_ids=33198675&key=userdates&access_token=881ff904881ff904881ff9040688779a868881f881ff904d44d2e32db3a8e46303be4be&v=5.92';

  waitRequest(url).then( result => {
    return res.status(200).send( result )
  }).catch(error => {
    console.dir(error)
    return res.status(404).send("Not Found")
  })
})

sendRouter.get('/vkauth', (req, res) => {
  const url = 'https://oauth.vk.com/authorize?client_id=6841218&display=popup&redirect_uri=https://vkapp.apps-web.xyz/afterauth&group_ids=177563473&scope=messages&response_type=code&v=5.92';
  return res.redirect(301, url);
})
*/