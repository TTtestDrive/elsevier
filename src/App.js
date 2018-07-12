import React, { Component} from 'react';
import EnhancedTable from './components/MainTable';
import MainMenu from './components/MainMenu';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import secondary from '@material-ui/core/colors/lightBlue';
import primary from '@material-ui/core/colors/deepOrange';


const theme = createMuiTheme({
  palette: {
    primary: primary,
    secondary: secondary,
  },
  status: {
    danger: 'orange',
  },
});
class App extends Component{
  render(){
    return(
      <div>
      <MuiThemeProvider theme={theme}>   
      <MainMenu />
      <EnhancedTable />
          </MuiThemeProvider>
      </div>
        )
    }

}

export default App;
