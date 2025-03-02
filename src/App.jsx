import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";


  const App = () => {

    // <======================================== NOTES START ==============================================>

  // Libraries used :   "tailwind-css" for css
  // Read the documentaion in their respective sites for the above mentioned libraries before making changes in the code.
  // To run the code: npm run dev
  // First install all dependencies :- npm intsall
  // Then run the code :- npm run dev
  // to build code :-  npm run build
  // created date : 7-11-2024 || created by : Arjun  || module : 1 ||
  // modified date : 7/11/2024 || modified by : Arjun || module : 1 ||
  // modified date : 7/11/2024 || modified by : Arjun ck  || module : 1 ||
  // Technical summary(Pre-setups) created date/by :  Arjun ||
  // Domain :   || 
  // Hosting :   ||
  // SSL :   ||
  // Database :  ||

  // Phase summary :   || created date/by :  Arjun  ||
  // Phase 1 :  Git hub creation  ||  
  // Phase 2 :  Development/Main page creation ||
  // Phase 3 :  Production  ||

  // <======================================== NOTES END ==============================================>
  return(
    <>

      <RouterProvider router={router} />

      <ToastContainer autoClose={5000}  position="bottom-right" />
    </>
  )
}
  
  

export default App;


