import request from '@/utils/request';
import siteConfig from '@/utils/siteConfig';

const { AppIdForPlatform } = siteConfig;

export function queryParams() {
  return request.post('/platform_api/open/system/fornt/params');
}

export function queryDicts() {
  return request('/platform_api/rest/system/dict/list', {
    method: 'post',
    params: {
      appId: AppIdForPlatform
    },
    data: {
      orders: [],
      page: {},
      queryFilters: []
    }
  })
}
