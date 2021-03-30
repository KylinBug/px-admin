import { authUser, authUserMenus } from '@/services/user';

const UserModel = {
  namespace: 'user',
  state: {
    loginUser: {},
    userMenus: [],
  },
  effects: {
    *fetchLoginUser(_, { call, put }) {
      const response = yield call(authUser);
      const { data } = response;

      yield put({
        type: 'saveLoginUser',
        payload: data,
      });
      yield put({ type: 'fetchUserMenus' });
    },

    *fetchUserMenus(_, { call, put }) {
      const response = yield call(authUserMenus);
      const { data } = response;

      yield put({
        type: 'saveUserMenus',
        payload: data,
      });
    },
  },
  reducers: {
    saveLoginUser(state, { payload }) {
      return { ...state, loginUser: { ...payload, avatar: '/avatar/avatar.jpg' } || {} };
    },

    saveUserMenus(state, { payload }) {
      return {
        ...state,
        userMenus: payload || [],
      };
    },
  },
};

export default UserModel;
