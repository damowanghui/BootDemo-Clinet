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
