import React, { useState } from "react";
import Login from "./components/Login";
import TaskManager from "./components/TaskManager";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <TaskManager />}
    </div>
  );
};

export default App;
