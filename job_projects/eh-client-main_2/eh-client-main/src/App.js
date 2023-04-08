import React ,{useContext,useEffect}from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import routes, { renderRoutes } from './routes';
import { BASENAME } from './config/constant';
import 'ag-grid-enterprise';
import './assets/scss/partials/agGrid.scss'
import { ConfigContext } from './contexts/ConfigContext';

const App = () => {
   const configContext = useContext(ConfigContext);
   const { layoutType } = configContext.state;  
   useEffect(() => {
     const root = document.documentElement;
     root?.style.setProperty(
       "--b-color",
       layoutType==='menu-dark' ? "var(--ag-light)" : "var(--ag-dark)"
     );
     root?.style.setProperty(
      "--odd-color",
      layoutType==='menu-dark' ? "var(--odd-row-dark)" : "var(--odd-row-light)"
    );
     root?.style.setProperty(
      "--border-color",
      layoutType==='menu-dark' ? "var(--border-color-light)" : "var(--border-color-dark)"
    );
     root?.style.setProperty("--text-color", layoutType==='menu-dark' ? "var(--text-light-color)":"var(--text-dark-color)"  );

   }, [layoutType]);

   return (
      <React.Fragment>
         <Router basename={BASENAME}>{renderRoutes(routes)}</Router>
      </React.Fragment>
   );
};

export default App;
