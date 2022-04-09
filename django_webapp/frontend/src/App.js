import React from 'react'; 
import axios from 'axios';
import './App.css'
import Navbar from './components/navbar/Navbar';
import ArticleGeneration from './components/articleGeneration/ArticleGeneration';
class App extends React.Component {

  render() {
    return(
      <div>
        <Navbar />
        <ArticleGeneration />
      </div>
      ); 
  } 
} 
export default App;