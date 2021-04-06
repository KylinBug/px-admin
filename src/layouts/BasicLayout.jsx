/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { SettingDrawer } from '@ant-design/pro-layout';
import CommonFooter from '@/components/GlobalFooter/CommonFooter';
import React, { useEffect } from 'react';
import { Link, useIntl, connect } from 'umi';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/logo.svg';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

/**
 * use Authorized check all menu item
 */
const menuDataRender = (menuList) =>
  menuList.map((item) => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null);
  });

// const menuDataFormat = menuList =>
//   menuList.map(item => ({ ...item, path: item.href, name: item.resourceName, icon: '', children: item.children ? menuDataFormat(item.children) : [] }));

const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    // userMenus,
    settings,
    location = {
      pathname: '/',
    },
  } = props;

  useEffect(() => {
    dispatch({
      type: 'global/fetchDicts',
    });
  }, []);

  /**
   * init variables
   */
  const handleMenuCollapse = (payload) => {
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload,
    });
  };

  // get children authority
  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  const { formatMessage } = useIntl();
  // 'menu.home': 'hi, tmd {foo} - {bar}',
  // formatMessage(
  //   {
  //     id: 'menu.home',
  //     defaultMessage: '奶奶的'
  //   },
  //   {
  //     foo: '你妈的',
  //     bar: 'tmd'
  //   }
  // )

  return (
    <>
      <ProLayout
        logo={logo}
        // formatMessage={formatMessage}
        menuHeaderRender={(logoDom, titleDom) => (
          <Link to="/">
            {logoDom}
            {titleDom}
          </Link>
        )}
        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: formatMessage({
              id: 'menu.home',
            }),
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        footerRender={() => <CommonFooter />}
        menuDataRender={menuDataRender}
        // menuDataRender={() => menuDataFormat(userMenus)}
        rightContentRender={() => <RightContent />}
        {...props}
        {...settings}
      >
        <Authorized authority={authorized.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      </ProLayout>

      <SettingDrawer
        settings={settings}
        onSettingChange={(config) =>
          dispatch({
            type: 'settings/changeSetting',
            payload: config,
          })
        }
      />
    </>
  );
};

export default connect(({ global, user, settings }) => ({
  collapsed: global.collapsed,
  userMenus: user.userMenus,
  settings,
}))(BasicLayout);
