import siteConfig from '../src/utils/siteConfig';

const { siteName } = siteConfig;

export default {
  navTheme: 'dark',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'sidemenu',
  contentWidth: 'Fluid',
  fixedHeader: true,
  autoHideHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: siteName,
  pwa: false,
  iconfontUrl: '',
};
