import React, { useState } from 'react';

import './App.css';
import Title from '../Title/Title';
import Config from '../Config/Config';
import Terminal from '../Terminal/Terminal';

const App = () => {
  const [outputAll, setOutputAll] = useState(false);
  const [maxSteps, setMaxSteps] = useState('');

  return (
    <div className="App">
      <Title />
      <Config outputAll={outputAll} setOutputAll={setOutputAll} maxSteps={maxSteps} setMaxSteps={setMaxSteps} />
      <Terminal outputAll={outputAll} maxSteps={maxSteps} />
    </div>
  );
};

export default App;
