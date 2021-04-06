/* eslint-disable no-shadow */
import { message } from 'antd';
// import { stringify } from 'qs';
import { history, Redirect } from 'umi';
import { authToken, authLogout } from '@/services/sign';
// import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import pathRegexp from 'path-to-regexp';
import request from '@/utils/request';
import { getToken, setToken, removeToken } from '@/utils/token';

const setAuthOfRequest = (token) => {
  request.extendOptions({
    headers: {
      Authorization: token || getToken(),
    },
  });
};

const SignModel = {
  namespace: 'sign',
  state: {
    status: undefined,
    type: 'password',
    accessToken: getToken(),
  },
  effects: {
    *signIn({ payload }, { call, put }) {
      const response = yield call(authToken, payload);

      const { data } = response;
      const { access_token } = data || {};
      yield put({
        type: 'saveToken',
        payload: access_token,
      });
      setToken(access_token);
      setAuthOfRequest();

      yield put({
        type: 'user/fetchLoginUser',
      });

      if (response.state) {
        message.success('登录成功！');
        // const urlParams = new URL(window.location.href);

        const params = getPageQuery();
        const { redirect, ...otherQuery } = params;

        // if (redirect) {
        //   const redirectUrlParams = new URL(redirect);

        //   if (redirectUrlParams.origin === urlParams.origin) {
        //     redirect = redirect.substr(urlParams.origin.length);

        //     if (redirect.match(/^\/.*#/)) {
        //       redirect = redirect.substr(redirect.indexOf('#') + 1);
        //     }
        //   } else {
        //     window.location.href = redirect;
        //     return;
        //   }
        // }

        history.replace({ pathname: redirect || '/', query: otherQuery });
      }
    },

    *signOut(_, { call }) {
      yield call(authLogout);
      removeToken();
      history.replace({ pathname: '/user/login' });

      // const { redirect } = getPageQuery(); // Note: There may be security issues, please note

      // if (window.location.pathname !== '/user/login' && !redirect) {
      //   history.replace({
      //     pathname: '/user/login',
      //     search: stringify({
      //       redirect: window.location.href,
      //     }),
      //   });
      // }
    },
    // *signedCheck(_, { call }) {
    //   const response = yield call(authLogined);
    //   // eslint-disable-next-line no-console
    //   console.log(response);
    // },
  },
  reducers: {
    saveToken(state, { payload }) {
      return { ...state, accessToken: payload };
    },
    // changeLoginStatus(state, { payload }) {
    //   setAuthority(payload.currentAuthority);
    //   return { ...state, status: payload.status, type: payload.type };
    // },
  },
  subscriptions: {
    // 通过接口判断是否需要登录，即 errorHandler 处理无权限跳转登录页，
    // 很多api是不需要登录即可访问的，所以不是必须在hedser中携带token的，
    // 如果强制携带token，反而是不正确的业务逻辑
    setupToken({ dispatch, history }) {
      setAuthOfRequest();
      if (pathRegexp('/user/login').exec(history.location.pathname)) return;
      dispatch({ type: 'user/fetchLoginUser' });
    },
    // setupTimeout({ history }) {
    //   history.listen(({ pathname, query }) => {
    //     console.log('location==', query);
    //     dispatch({ type: 'signedCheck' })
    //   })
    // }
  },
};

export default SignModel;
