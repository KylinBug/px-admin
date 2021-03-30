/* eslint-disable no-shadow */
import { message } from 'antd';
// import { stringify } from 'qs';
import { history } from 'umi';
import { authToken, authLogout, authLogined } from '@/services/sign';
// import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import request from '@/utils/request';
import { getToken, setToken, removeToken } from '@/utils/token';

const setAuthOfRequest = () => {
  request.extendOptions({
    headers: {
      Authorization: getToken(),
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

      history.replace({ pathname: '/user/login' });
      removeToken();

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
    setupToken({ dispatch }) {
      setAuthOfRequest();
      dispatch({ type: 'user/fetchLoginUser' });
    },
    // setupTimeout() {
    //   history.listen(({ pathname, query }) => {
    //     console.log('location==', query);
    //     dispatch({ type: 'signedCheck' })
    //   })
    // }
  },
};

export default SignModel;
