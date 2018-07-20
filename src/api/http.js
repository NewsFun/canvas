/* eslint-disable */
import Axios from 'axios'

export function http(url, data, type) {
  let reqType = type || 'post'
  let config = {
    url: url,
    method: reqType
  }
  if (reqType.toLowerCase() === 'get') {
    config.params = data
  } else {
    config.data = data
    // config.headers = {
    //   'content-Type': 'application/json; charset=UTF-8'
    // }
  }
  return Axios(config);
}
