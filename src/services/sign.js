import request from '@/utils/request';

export function authToken(data) {
  const formData = new FormData();
  for (let key of Object.keys(data)) {
    formData.append(key, data[key])
  }
  return request('/platform_api/auth/token', {
    method: 'post',
    data: formData
  });
}

export function authLogout() {
  return request.post('/platform_api/auth/logout');
}

export function authLogined() {
  return request.post('/platform_api/auth/logined');
}
