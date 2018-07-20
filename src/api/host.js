let host = 'http://refueling.test.mycrudeoil.com/'
const hostname = window.location.hostname
if (hostname !== 'localhost') {
  host = ''
}
export default host
