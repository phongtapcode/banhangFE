import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";
// import store from "./redux/store";
import { Provider } from "react-redux";
import { QueryClientProvider,QueryClient } from "@tanstack/react-query";
import { PersistGate } from 'redux-persist/integration/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import persistConfig from "./redux/persistConfig.jsx";

const { store, persistor } = persistConfig();
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
    </Provider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
