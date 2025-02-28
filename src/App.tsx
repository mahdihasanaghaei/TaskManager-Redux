
import { Provider } from 'react-redux';
import { store } from './store/store';
import Index from './pages/Index';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: 'hsl(222.2, 47.4%, 11.2%)', // Using the existing primary color
    },
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Index />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
