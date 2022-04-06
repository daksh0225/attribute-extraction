import React from 'react'; 
import axios from 'axios';
import Navbar from './components/navbar/Navbar';
class App extends React.Component {

  componentDidMount() {

      let data ;

      axios.get('http://localhost:8000/')
      .then(res => {
          data = res.data;
          this.setState({
              details : data    
          });
      })
      .catch(err => {})
  }

  render() {
    return(
      <div>
        <Navbar />
        Body
      </div>
      ); 
  } 
} 
export default App;