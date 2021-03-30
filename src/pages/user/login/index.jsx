import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import { Alert, Checkbox } from 'antd';
import React, { useState } from 'react';
import { Link, connect } from 'umi';
import styles from './style.less';
import LoginFrom from './components/Login';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginFrom;

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = props => {
  const { sign = {}, submitting } = props;
  const { status, type: loginType } = sign;
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState('password');

  const handleSubmit = values => {
    const { dispatch } = props;
    dispatch({
      type: 'sign/signIn',
      payload: { ...values, 'grant_type': type },
    })
  };

  return (
    <div className={styles.main}>
      <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        {/* grant_type: password, dynamic, refresh_token, sms, remote, isc */}
        <Tab key="password" tab="账户口令登录">
          {status === 'error' && loginType === 'password' && !submitting && (
            <LoginMessage content="账户或口令错误" />
          )}
          <UserName
            name="username"
            placeholder="用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="口令"
            rules={[
              {
                required: true,
                message: '请输入口令！',
              },
            ]}
          />
        </Tab>

        <Tab key="mobile" tab="手机号登录">
          {status === 'error' && loginType === 'mobile' && !submitting && (
            <LoginMessage content="验证码错误" />
          )}
          <Mobile
            name="mobile"
            placeholder="手机号"
            rules={[
              {
                required: true,
                message: '请输入手机号！',
              },
              {
                pattern: /^1\d{10}$/,
                message: '手机号格式错误！',
              },
            ]}
          />
          <Captcha
            name="captcha"
            placeholder="验证码"
            countDown={120}
            getCaptchaButtonText=""
            getCaptchaSecondText="秒"
            rules={[
              {
                required: true,
                message: '请输入验证码！',
              },
            ]}
          />
        </Tab>

        <div>
          <Checkbox checked={autoLogin} onChange={e => setAutoLogin(e.target.checked)}>
            自动登录
          </Checkbox>
          <a
            style={{
              float: 'right',
            }}
          >
            忘记口令
          </a>
        </div>

        <Submit loading={submitting}>登录</Submit>

        {/* <div className={styles.other}>
          其他登录方式
          <AlipayCircleOutlined className={styles.icon} />
          <TaobaoCircleOutlined className={styles.icon} />
          <WeiboCircleOutlined className={styles.icon} />
          <Link className={styles.register} to="/user/register">
            注册账户
          </Link>
        </div> */}

      </LoginFrom>
    </div>
  );
};

export default connect(({ sign, global, loading }) => ({
  sign,
  global,
  submitting: loading.effects['sign/signIn'],
}))(Login);
