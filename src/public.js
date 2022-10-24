var leave = document.querySelector("#message .leave")
var operationButton = document.querySelectorAll("#message .operation button")
var message = document.querySelector("#message .message")
var byMessage = document.querySelector("#message")
var input = document.querySelector('#message #inputValue')
var send = document.querySelector('#message #send')
var pinImg = document.querySelector("#message .pin-img")
var pin = document.querySelector("#message .pin")
var messageFile = document.querySelector('#message [type="file"]')
var messageInfo = document.querySelector("#message .message-info")
var messageType = document.querySelector("#message .message-type")
var largeImg = document.querySelector("#message #large-img")
var invite = document.querySelector("#message .invite")
var respond = document.querySelector("#message .respond")
var messageBack = document.querySelector("#messageBack")
var infoBack = document.querySelector("#infoBack")

var messageOperator = document.querySelector(".message-operator")
const addProject = document.querySelector("#addProject")
const projectMessage = document.querySelector(".add-project-message")
const list = document.querySelector("#list")
var have = document.querySelector(".have")
var h4 = document.querySelector('#home h4')
var unknown = document.querySelector(".unknown")
var registerInput = document.querySelectorAll('#register input')
var home = document.querySelector("#home")
var userLogin = document.querySelector("#user-login")
var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
var login = document.querySelector('#login')
var loginInput = document.querySelectorAll('#login_update input')

let file = document.getElementById('file');
let fileImg = document.getElementById('fileImg')
var Information = document.querySelector('#Information')
var loginInput = document.querySelectorAll('#login_update input')
var loginUpdate = document.querySelector('#login_update')
var input = document.querySelector('#login_update [name="password"]')
var projectBack = document.querySelector("#projectBack")

var isUpdate = false
var userId = ''
var messageId = ''
var token = ''
var itemId = ''
let start = 0
let byStart = ''
let scrollDebug = ''
var dataMessage = []
var forceUpdate = false
var setInter = ''
var itemEl = ''

// 新增频道列表方法
addProject.onclick = function () {
  h4.innerText = 'add'
  isUpdate = false
  if (projectMessage.style.display === 'block') {
    projectMessage.style.display = 'none'
    list.style.display = 'block'

  } else {
    projectMessage.style.display = 'block'
    list.style.display = 'none'
  }
}

// 更改频道信息
function addMessage() {
  var messageInput = projectMessage.querySelectorAll('input')
  let data = {
  }
  // 获取所有的input框 赋值给data数据中
  Array.from(messageInput).map(item => {
    data[item.name] = item.value
  })
  var select = document.querySelector('select')
  // 判断是不是private
  data.private = select.value === 'private'
  let para = {
    method: 'POST',
    body: data
  }
  // 判断是不是更新
  if (isUpdate) {
    para.method = 'put'
    fetchRequire(`channel/${isUpdate.id}`, para).then(res => {
      projectMessage.style.display = 'none'
      list.style.display = 'block'
      homeInit()
    });
    return
  }
  // 新增数据
  fetchRequire(`channel`, para).then(res => {
    homeInit()
    addProject.click()
  });

}

// 频道列表初始化的方法  init
function homeInit(have = true) {
  let para = {
    method: 'GET'
  }
  fetchRequire(`channel`, para).then(res => {

    var listMessage = document.querySelector('#list-message')
    let ele;
    while ((ele = listMessage.children.item(0))) {
      ele.remove();
    }
    var data = res.channels
    if (have) {
      data = res.channels.filter(item => item.members.includes(Number(userId)))
    } else {
      data = res.channels.filter(item => !item.members.includes(Number(userId)))
    }
    var privateMessage = data.filter(item => item.private)
    var publicMessage = data.filter(item => !item.private)
    privateMessage.concat(publicMessage).map(item => {
      var div = createElement('div', 'list-project')

      var p1 = createElement('p')
      p1.innerText = `【${item.private ? 'private' : 'public'}】${item.name}`

      div.appendChild(p1)

      var p2 = createElement('span')
      p2.innerText = 'update'
      p2.onclick = function (e) {
        e.stopPropagation()
        projectMessage.style.display = 'block'
        list.style.display = 'none'
        let data = {
        }
        Array.from(projectMessage.querySelectorAll('input')).map(input => {
          input.value = item[input.name]
        })
        isUpdate = item
        h4.innerText = 'update'
        var select = document.querySelector('select')
        data.private = select.value === 'private'
      }

      div.appendChild(p2)
      div.onclick = function (e) {
        e.preventDefault()
        messageId = item.id
        document.querySelector("#message").style.display = 'block'
        home.style.display = 'none'
        messageInit(true)
        setInFun()
        messageType.querySelector("button").click()
      }
      listMessage.appendChild(div)
    })
  });

}

function setInFun() {
  clearInterval(setInter)
  setInter = setInterval(() => {
    messageInit(5)
  }, 6000)
}

// 登录的方法
function authLogin() {
  let data = {}
  // 获取所有的input数据 赋值给data
  Array.from(document.querySelectorAll('#login input')).map(item => {
    data[item.name] = item.value
  })
  let para = {
    method: 'POST',
    body: data
  }
  fetchRequire(`auth/login`, para).then(res => {
    userId = res.userId
    token = res.token
    userLogin.style.display = 'none'
    home.style.display = 'block'
    homeInit(true)
  });
}

// 注册的方法
function registerMessage() {
  let data = {
  }
  Array.from(registerInput).map(item => {
    data[item.name] = item.value
  })
  // 校验邮箱 是否合规
  if (!reg.test(data.email)) {
    return alert('Email error')
  }
  // 校验密码是否一致
  if (data.password !== data.confirmPassword) {
    return alert('Inconsistent passwords')
  }
  let para = {
    method: 'POST',
    body: data
  }
  fetchRequire(`auth/register`, para).then(res => {
    login.style.display = 'block'
    register.style.display = 'none'
    alert('success')
  });
}

// 注册的display切换
function registerDisplay() {
  login.style.display = 'none'
  register.style.display = 'block'
}

// 添加元素 封装方法
function appendChild(el, children = []) {
  children.map(itme => {
    el.appendChild(itme)
  })
}

// 封装创建元素
// el 元素名称
// className class名称
// text 默认内容
// attr 文本信息
function createElement(el, className = '', text = '', attr = {}) {
  let div = document.createElement(el)
  div.className = className
  div.innerText = text
  Object.keys(attr).map(item => {
    div.setAttribute(item, attr[item])
  })
  return div
}

// 获取用户信息列表
function getInfoList() {
  let infoData = {
    method: 'GET'
  }

  fetchRequire(`user`, infoData).then(res => {
    res.users.sort(function (s1obj, s2obj) {
      var s1 = s1obj.email
      var s2 = s2obj.email
      x1 = s1.toUpperCase();
      x2 = s2.toUpperCase();
      if (x1 < x2) {
        return -1;
      }
      if (x1 > x2) {
        return 1;
      }
      return 0;
    });
    var listChild = []
    res.users.map(item => {
      var p = createElement('p', '', item.email, { id: item.id })
      p.onclick = function () {
        let data = {
          method: 'post',
          body: {
            userId: item.id
          }
        }
        fetchRequire(`channel/${messageId}/invite`, data).then(res => {
          invite.querySelector("div").style.display = 'none'
          alert("success")
        })

      }
      listChild.push(p)
    })
    appendChild(invite.querySelector("div"), listChild)
  });
}

// 获取某个用户的详情
function getInfo() {
  let infoData = {
    method: 'GET'
  }
  fetchRequire(`user/${userId}`, infoData).then(res => {
    // 数据对应元素展示上去
    messageInfo.querySelector('p:nth-of-type(1) span').innerText = 'name:' + res.name
    messageInfo.querySelector('p:nth-of-type(2) span').innerText = 'email:' + res.email
    messageInfo.querySelector('p:nth-of-type(3) span').innerText = 'bio:' + res.bio
    messageInfo.querySelector('img').src = res.image || './img/head.png'
  });
}


// 获取频道信息
function join() {
  let joinData = {
    method: 'post'
  }
  fetchRequire(`channel/${messageId}/join`, joinData, false).then(res => { });
}

// 渲染数据
function render(value, bool, children) {
  let ele;
  if (!children) {
    if (start === 0) {
      while ((ele = message.children.item(0))) {
        ele.remove();
      }
    }
  }
  var data = value
  if (children) {
    data = children
  } else if (bool === 2) {
    data = data.filter(item => item.pinned)
  } else if (bool === 3) {
    data = data.filter(item => item.image)
  }
  data.map((item, index) => {
    var div = createElement('div', 'rest')
    var span1 = createElement('span', '', 'userId：' + item.sender, { id: item.sender, start: start })
    var span2 = createElement('span', 'context', item.message, {
      id: item.id
    })
    var imgList = []
    var _item = item
    item.reacts.map(item => {
      var img = createElement('span', '', item.react)
      img.onclick = function (e) {
        e.stopPropagation()
        let messageData = {
          method: 'post',
          body: {
            react: item.react
          }
        }
        fetchRequire(`message/unreact/${messageId}/${_item.id}`, messageData).then(res => {
          var _start = message.querySelector(`span[id='${_item.id}']`).parentNode.childNodes[0].getAttribute('start')
          fetchRequire(`message/${messageId}?start=` + _start, { method: 'GET' }).then(res => {
            var el = render('', '', res.messages.filter(item => item.id === _item.id))
            var parEl = message.querySelector(`span[id='${_item.id}']`).parentNode
            parEl.parentNode.replaceChild(el[0].div, parEl)
            el[0].div.childNodes[0].setAttribute('start', _start)
          })
        });
      }
      imgList.push(img)
    })
    var span3 = createElement('div', 'chartlet')
    appendChild(span3, imgList)
    var timeout = ''
    div.onmousedown = function (e) {
      timeout = setTimeout(() => {
        itemId = item.id
        itemEl = item
        respond.style.display = 'block'
        respond.style.top = e.clientY + 'px'
        respond.style.left = e.clientX + 'px'
      }, 500);
    }
    div.onmouseup = function () {
      clearTimeout(timeout)
    }
    if (item.image) {
      span2 = document.createElement('img')
      span2.style.width = "100px"
      span2.src = item.image
      span2.onclick = function (e) {
        large.style.display = 'flex'
        largeImg.src = e.target.src
        large.onclick = function () {
          large.style.display = ''
        }
      }
    }
    appendChild(div, [span1, span2, span3])
    !children && appendChild(message, [div])
    item.div = div
    return div
  })

  if (children) {
    return data
  }

  var pinned = data.find(item => item.pinned)
  if (pinned) {
    itemId = pinned.id
    // pin.querySelector('span').innerText = pinned.message
    // pin.style.display = 'block'
  } else {
    // pin.style.display = 'none'
  }

  if (start === 0) {
    message.scrollTop = 0
  }
}
sessionStorage.data = ''
// 获取频道消息信息
function getMessage(bool = 1, isUpdate = false) {
  let messageData = {
    method: 'GET'
  }
  fetchRequire(`message/${messageId}?start=` + start, messageData).then(res => {
    if (!isUpdate && sessionStorage.data && res.messages.length && JSON.parse(sessionStorage.data)[0].id === res.messages[0].id) {
      return
    }
    if (res.messages.length < 25) {
      start - 25
      scrollDebug = true
    } else {
      scrollDebug = false
    }

    sessionStorage.data = JSON.stringify(res.messages)
    render(res.messages, bool)
    var resLast = res.messages[0] || {}
    var dataLast = dataMessage[0] || {}
    if (start === 0 && resLast.id !== dataLast.id) {
      pin.style.display = 'block'
      if (resLast.message) {
        pin.querySelector('span').innerText = resLast.message || ''
      }
    }
    dataMessage = res.messages
    var loding = document.querySelector('.loding')
    loding && loding.parentNode.removeChild(loding)
  })
}

// 频道的初始化方法  所有的信息在这里 
function messageInit(init = false) {
  // 获取信息
  getMessage()
  if (init) {
    // 获取频道信息
    join()
    // 获取可邀请好友列表
    getInfoList()
  }
  let para = {
    method: 'GET'
  }
  fetchRequire(`channel/` + messageId, para).then(res => {
    var messageTitle = document.querySelector("#message .message-title")
    let ele;
    while ((ele = messageTitle.children.item(0))) {
      ele.remove();
    }
    appendChild(messageTitle, [
      createElement('h2', '', 'name：' + res.name),
      createElement('p', '', 'description：' + res.description),
      createElement('p', '', 'createdAt：' + res.createdAt)
    ])
  });
}

// 更新用户资料信息
function updateInit() {
  let para = {
    method: 'GET'
  }
  fetchRequire(`user/` + userId, para).then(res => {
    // 获取全部的input并且把数据展示到页面中
    Array.from(loginInput).map(item => {
      item.name && (item.value = res[item.name] || '')
    })

    fileImg.src = res.image
  });
}

// passowrd跟文本切换
function eye(e) {
  if (!e.target.src.includes('eye_none')) {
    e.target.src = './img/eye_none.png'
    input.type = 'text'
  } else {
    input.type = 'password'
    e.target.src = './img/eye.png'
  }
}

// 更改个人信息
function updateMessage() {
  Array.from(loginInput).map(item => {
    item.name && (data[item.name] = item.value)
  })
  // 删除email操作 邮箱禁止修改
  delete data.email
  let para = {
    method: 'PUT',
    body: data
  }
  fetchRequire(`user`, para).then(res => {
    token = res.token
    alert('Modified successfully')
    location.reload();
  });
}

// url改变监听方法
// url改变以后执行具体的操作，如profile到用户页面  channel到信息页面，并且开启计时器

function urlUpdate() {
  // 隐藏全部的元素 下面按指定条件展示元素
  userLogin.style.display = 'none'
  home.style.display = 'none'
  byMessage.style.display = 'none'
  login_update.style.display = 'none'

  if (window.location.href.includes('#profile')) {
    userId = window.location.href.match(/\#profile=(.+?)$/) ? window.location.href.match(/\#profile=(.+?)$/)[1] : userId
    login_update.style.display = 'block'
    userLogin.style.display = 'none'
    login_update.querySelector('h4').innerText = ''
    login_update.querySelector('button').style.display = 'none'

    let userData = {
      method: 'GET'
    }
    fetchRequire(`user/${userId}`, userData).then(res => {
      Array.from(loginInput).map(item => {
        item.name && (item.value = res[item.name])
      })

      fileImg.src = res.image
    });
  } else if (window.location.href.includes('#channel')) {
    messageId = window.location.href.match(/\#channel=(.+?)$/) ? window.location.href.match(/\#channel=(.+?)$/)[1] : messageId
    byMessage.style.display = 'block'
    messageInit(true)
    // 开启计时器 3秒执行一次 获取最新数据  轮询方法
    setInFun()
  } else {
    userLogin.style.display = 'block'
  }
}