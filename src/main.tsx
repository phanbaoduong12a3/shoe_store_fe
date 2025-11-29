import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConfigProvider, App as AntdApp } from 'antd';

import App from './App.tsx';
import store from './stores';
import 'antd/dist/reset.css';
import './themes/_reset.scss';
import './themes/_global.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Manrope-400',
          colorPrimary: '#4a90e2',
          colorText: '#171717',
          colorError: '#FF7777',
        },
        components: {
          Table: {
            borderColor: '#C5CFD9',
          },
          Radio: {
            dotSize: 16,
            radioSize: 24,
          },
        },
      }}
    >
      <AntdApp>
        <App />
      </AntdApp>
    </ConfigProvider>
  </Provider>,
  // </React.StrictMode>,
);
