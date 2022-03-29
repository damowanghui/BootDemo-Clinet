import axios from 'axios'
import {getToken} from "./auth";

let uploadUrl = '/api/file/uploadFile'

export function getUploadParam() {
  let uploadParam = {
    action: uploadUrl,
    multiple: false,
    limit: 5,
    autoUpload: false,
    accept: "application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, image/jpeg, image/png",
    fileList: []
  }
  return uploadParam;
}

export function uploadFileList(files) {
  return axios({
    url: uploadUrl,
    headers: {
      'Content-type': 'multipart/form-data',
      'token': getToken()
    },
    method: 'post',
    data: files
  })
}

export function downloadFile(fileId) {
  let downloadUrl = "/api/file/downloadFile/" + fileId
  return axios({
    url: downloadUrl,
    headers: {
      'Content-type': 'multipart/form-data',
      'token': getToken()
    },
    method: 'get',
    responseType: 'blob'
  }).then((res) => {
    let blob = new Blob([res.data], {type: res.data.type})
    let link = document.createElement('a')
    let href= window.URL.createObjectURL(blob)
    let body = document.querySelector('body')
    link.href = href
    link.style.display = 'none'
    link.download = 'download'
    body.appendChild(link)
    link.click()        // 创建了新的a标签之后模拟点击事件，开始传输文件
    body.removeChild(link)  // 下载完成之后，移除按钮，垃圾回收，减少页面内存消耗
    window.URL.revokeObjectURL(link.href)
  }).catch((err) => {
    console.error(err)
  })
}
