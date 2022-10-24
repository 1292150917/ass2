
have.onclick = function () {
  homeInit(true)
}
unknown.onclick = function () {
  homeInit(false)
}

// 监听message的滚动事件，判断是不是到底部 如果到底部了添加img加载动画，如果未到底部不执行
message.addEventListener('scroll', () => {
  if (scrollDebug) {
    return
  }
  const clientHeight = message.clientHeight;
  const scrollTop = message.scrollTop;
  const scrollHeight = message.scrollHeight;
  if ((clientHeight + scrollTop + 1) > scrollHeight) {
    var img = document.createElement('img')
    img.className = 'loding'
    img.src = './img/loding.gif'
    start = start + 25
    message.appendChild(img)
    getMessage()
  }
})

// 给window绑定url改变事件  如果url改变的就触发
window.onhashchange = function () {
  urlUpdate()
};

urlUpdate()


// icon图表回应事件，如果有icon选择就调用接口，并且同时隐藏respond元素
Array.from(respond.querySelectorAll('span')).map(item => {
  item.onclick = function (e) {
    let messageData = {
      method: 'post',
      body: {
        react: e.target.innerText
      },
    }
    fetchRequire(`message/react/${messageId}/${itemId}`, messageData).then(res => {
      respond.style.display = 'none'
      var _start = message.querySelector(`span[id='${itemEl.id}']`).parentNode.childNodes[0].getAttribute('start')
      fetchRequire(`message/${messageId}?start=` + _start, { method: 'GET' }).then(res => {
        var el = render('','',res.messages.filter(item =>item.id === itemEl.id))
        var parEl = message.querySelector(`span[id='${itemEl.id}']`).parentNode
        parEl.parentNode.replaceChild(el[0].div, parEl)
        el[0].div.childNodes[0].setAttribute('start',_start)
      })
    });
  }
})

messageOperator.querySelector('img').onclick = function () {
  messageFile.click()
}

// 图片的上传操作，上传完成以后执行fileReader 转换成base64 存储起来
messageFile.onchange = function () {
  let fileData = this.files[0];
  let pettern = /^image/;
  if (!pettern.test(fileData.type)) {
    alert("图片格式不正确");
    return;
  }
  let reader = new FileReader();
  reader.readAsDataURL(fileData);
  // 图片base64转换
  reader.onload = function (e) {

    let leaveData = {
      method: 'post',
      body: { image: this.result }
    }
    // 发送接口  并且发送完成以后重新拿去最新的消息列表数据
    fetchRequire(`message/${messageId}`, leaveData).then(res => {
      start = 0
      getMessage()
    });
  }
}

// 发送数据 获取数据的value作为data
send.onclick = function () {
  let leaveData = {
    method: 'post',
    body: { message: document.querySelector('#message #inputValue').value }
  }
  fetchRequire(`message/${messageId}`, leaveData).then(res => {
    document.querySelector('#message #inputValue').value = ''
    start = 0
    getMessage()
  });
}

// pin的按钮删除操作
pinImg.onclick = function () {
  let res = confirm('确定删除？');
  if (res == true) {
    let para = {
      method: 'post'
    }
    fetchRequire(`message/unpin/${messageId}/${itemId}`, para).then(res => {
      start = 0
      getMessage()
    });
  }
}

// 离开频道信息 
leave.onclick = function () {
  let leaveData = {
    method: 'post'
  }
  fetchRequire(`channel/${messageId}/leave`, leaveData).then(res => {
    location.reload();
  });
}

// 邀请好友进入
invite.querySelector("span").onclick = function () {
  if (invite.querySelector("div").style.display === 'block') {
    invite.querySelector("div").style.display = 'none'
    return
  }
  invite.querySelector("div").style.display = 'block'

}

// 信息列表右键方法监听
message.oncontextmenu = function (e) {
  var operation = document.querySelector("#message .operation")

  message.onclick = function () {
    messageInfo.style.display = 'none'
    operation.style.display = 'none'
    message.onclick = ''
  }
  if (e.target.id && e.target.className !== 'context') {
    e.preventDefault()
    userId = e.target.id
    messageInfo.style.display = 'block'
    getInfo()
    messageInfo.style.top = e.clientY + 30 + 'px'
    messageInfo.style.left = e.clientX + 'px'
    return
  }
  if (e.target.className !== 'context') {
    return
  }
  itemId = e.target.id
  itemEl = e.target
  e.preventDefault()
  operation.style.display = 'block'
  operation.style.top = e.clientY + 'px'
  operation.style.left = e.clientX + 'px'
}

// pin , button .delete 等操作绑定事件

Array.from(messageType.querySelectorAll("button")).map((item, index) => {
  item.onclick = function () {
    start = 0
    clearInterval(setInter)
    if(index === 0){
      setInFun()
    }
    getMessage(index + 1,true)
  }
})

//频道信息返回事件
messageBack.onclick = function () {
  loginAuth.click()
  clearInterval(setInter)
  byMessage.style.display = 'none'
}

// 更改用户信息的返回事件

infoBack.onclick = function () {
  loginAuth.click()
  login_update.style.display = 'none'
}

// 页面进入的时候 给聊天页面的右键添加点击事件
Array.from(operationButton).map((item, index) => {
  item.onclick = function () {
    // 更改弹出层 先屏蔽 后展示
    var operation = document.querySelector("#message .operation")
    operation.style.display = 'none'
    // 判断是更新就调用更新
    if (item.className === 'update') {
      var name = prompt('请输入需要最新内容', '');
      if (name != null && name != "") {
        let para = {
          method: 'put',
          body: { message: name }
        }
        fetchRequire(`message/${messageId}/${itemId}`, para).then(res => {
          getMessage()
        });
      }
    } else if (item.className === 'delete') {
      // 是button删除的方法
      let para = {
        method: 'delete'
      }
      fetchRequire(`message/${messageId}/${itemId}`, para).then(res => {
        getMessage()
      });
    } else if (item.className === 'butpin') {
      // pin的具体操作信息
      let para = {
        method: 'post'
      }
      fetchRequire(`message/pin/${messageId}/${itemId}`, para).then(res => {
        getMessage()
      });
    }
  }

})

