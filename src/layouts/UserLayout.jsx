import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import CommonFooter from '@/components/GlobalFooter/CommonFooter';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, useIntl, connect } from 'umi';
import React from 'react';
import SelectLang from '@/components/SelectLang';
import siteConfig from '@/utils/siteConfig';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';

const { CompanyName, RDCenter, siteName } = siteConfig;

const UserLayout = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>{siteName}</span>
              </Link>
            </div>
            <div className={styles.desc}>
              {siteName} 是{CompanyName}
              {RDCenter}最具影响力的 Web 设计规范
            </div>
          </div>
          {children}
        </div>
        <CommonFooter />
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
