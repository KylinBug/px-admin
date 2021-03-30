// import { queryNotices } from '@/services/user';
import { queryParams, queryDicts } from '@/services/platform';
// import store from 'store';

// const PARAMS = 'app-params';
// const DICTS = 'app-dicts';

const GlobalModel = {
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [],
    // params: store.get(PARAMS) || {},
    params: {},
    // dicts: store.get(DICTS) || {},
    dicts: {},
  },
  effects: {
    *fetchParams(_, { call, put }) {
      const response = yield call(queryParams);

      const params = response?.data?.platform || {};
      yield put({
        type: 'saveParams',
        payload: params,
      });
      // store.set(PARAMS, params)
    },

    *fetchDicts(_, { call, put }) {
      const response = yield call(queryDicts);

      const { data = [] } = response;
      const allDicts = {};
      data.forEach((item) => {
        if (allDicts.hasOwnProperty(item.dictType)) {
          allDicts[item.dictType].push(item);
        } else {
          allDicts[item.dictType] = [item];
        }
      });

      yield put({
        type: 'saveDicts',
        payload: allDicts,
      });
      // store.set(DICTS, allDicts)
    },

    // *fetchNotices(_, { call, put, select }) {
    //   const data = yield call(queryNotices);
    //   yield put({
    //     type: 'saveNotices',
    //     payload: data,
    //   });
    //   const unreadCount = yield select(
    //     state => state.global.notices.filter(item => !item.read).length,
    //   );
    //   yield put({
    //     type: 'user/changeNotifyCount',
    //     payload: {
    //       totalCount: data.length,
    //       unreadCount,
    //     },
    //   });
    // },

    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select((state) => state.global.notices.length);
      const unreadCount = yield select(
        (state) => state.global.notices.filter((item) => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },

    *changeNoticeReadState({ payload }, { put, select }) {
      const notices = yield select((state) =>
        state.global.notices.map((item) => {
          const notice = { ...item };

          if (notice.id === payload) {
            notice.read = true;
          }

          return notice;
        }),
      );
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter((item) => !item.read).length,
        },
      });
    },
  },
  reducers: {
    saveParams(state, { payload }) {
      return {
        ...state,
        params: payload,
      };
    },

    saveDicts(state, { payload }) {
      return {
        ...state,
        dicts: payload,
      };
    },

    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, collapsed: payload };
    },

    saveNotices(state, { payload }) {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },

    saveClearedNotices(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return {
        collapsed: false,
        ...state,
        notices: state.notices.filter((item) => item.type !== payload),
      };
    },
  },
  subscriptions: {
    // 白名单
    setupParams({ dispatch }) {
      dispatch({ type: 'fetchParams' });
    },
    // setup({ history }) {
    //   // Subscribe history(url) change, trigger `load` action if pathname is `/`
    //   // Google Analytics
    //   history.listen(({ pathname, search }) => {
    //     if (typeof window.ga !== 'undefined') {
    //       window.ga('send', 'pageview', pathname + search);
    //     }
    //   });
    // },
  },
};

export default GlobalModel;
