import request from '@/utils/request';

export function authUser() {
  return request.post('/platform_api/auth/user');
}

export function authUserMenus() {
  return request.post('/platform_api/auth/user/menus');
}
