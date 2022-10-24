const url = 'http://127.0.0.1:5005/'
function fetchRequire(route, parser, isErr = true,callback = '') {
  var bodyParser = {
    method: parser.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${token}`
    }
  }
  if(parser.method !== "GET"){
    bodyParser.body = JSON.stringify(parser.body || {})
  }
  return new Promise((resolve, reject) => {
    fetch(url + route, bodyParser).then(res => {
      callback && callback(res)
      if (res.status === 200) {
        res.json().then(res => {
          resolve(res)
        })
      } else {
        res.json().then(res => {
          isErr && alert(res.error)
          reject(res)
        })
      }
    })
  })
}