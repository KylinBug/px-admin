/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { history } from 'umi';
import { notification } from 'antd';
// import { getToken } from '@/utils/token';
import siteConfig from './siteConfig';

const { AppCodeForPlatform, IPAddress } = siteConfig;

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const reLoginCode = ['401', '403'];

/**
 * 异常处理程序
 */
const errorHandler = (error) => {
  // const { name, type, data, response, request } = error;
  const {
    data,
    response,
    //  name, type, request
  } = error;
  const { code, data: message } = data;

  // console.log('error==', error.toSource());
  // console.log('error==', Object.keys(error));
  // console.log('name==', name);
  // console.log('type==', type);
  // console.log('data==', data);
  // console.log('response==', response);
  // console.log('request==', request);

  // 统一错误消息提示
  if (response && response.status) {
    // notification.error({
    //   description: message,
    //   message: code,
    // });
    // const errorText = codeMessage[response.status] || response.statusText;
    // const { status, url } = response;
    // notification.error({
    //   message: `请求错误 ${status}: ${url}`,
    //   description: errorText,
    // });
    // console.log({
    //   message: `请求错误 ${status}: ${url}`,
    //   description: errorText,
    // });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }

  // 重登录
  if (reLoginCode.includes(code)) {
    const { pathname, query } = history.location;
    if (pathname !== '/user/login') {
      history.replace({
        pathname: '/user/login',
        query: {
          ...query,
          redirect: history.location.pathname,
        },
      });
    }
  }

  return response;
};

/**
 * 权限接口校验 headers.Authorization
 */
// async function checkAuthorization(ctx, next) {
//   const headers = ctx?.req?.options?.headers || {};
//   const token = getToken() || ''
//   if (token) {
//     ctx.req.options.headers = {
//       ...headers,
//       Authorization: token
//     }
//   } else {
//     const { pathname, query } = history.location;
//     if (pathname !== '/user/login') {
//       history.replace({
//         pathname: '/user/login',
//         query: {
//           ...query,
//           redirect: history.location.pathname
//         }
//       })
//     }
//   }

//   await next()
// }

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler,
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  timeout: 0,
  headers: {
    AppCode: AppCodeForPlatform,
    IPAddress: IPAddress,
  },
});

// request.use(checkAuthorization)

export default request;
