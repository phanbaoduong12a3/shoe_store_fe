import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConfigProvider, App as AntdApp } from 'antd';

import App from './App.tsx';
import store from './stores';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ConfigProvider
      theme={{
        hashed: false,
      }}
    >
      <AntdApp>
        <App />
      </AntdApp>
    </ConfigProvider>
  </Provider>
);
