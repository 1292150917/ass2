let data = {
}
// base64的图片转换
file.onchange = function () {
  let fileData = this.files[0];
  let pettern = /^image/;
  if (!pettern.test(fileData.type)) {
    alert("The image format is not correct");
    return;
  }
  let reader = new FileReader();
  reader.readAsDataURL(fileData);
  reader.onload = function (e) {
    data.image = this.result
    fileImg.src = this.result
  }
}

Information.onclick = function () {
  updateInit()
  loginUpdate.style.display = 'block'
  home.style.display = 'none'
}

projectBack.onclick = function(){
  projectMessage.style.display = 'none'
  list.style.display = 'block'
}