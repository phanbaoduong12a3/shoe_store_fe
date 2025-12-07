import AppRoutes from './routers';
import { useAppInit } from './hooks/app-init';

const App = () => {
  useAppInit();
  return <AppRoutes />;
};

export default App;
