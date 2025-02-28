import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SpecialSymbol = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // Regex pattern to detect special characters in the URL
    const invalidPattern = /[@#!$%^&*()_+|~=`{}\[\]:";'<>?,\\]/;

    useEffect(() => {
        if (invalidPattern.test(location.pathname)) {
            navigate('/error/401', { replace: true }); // Redirect to 401 page
        }
    }, [location.pathname, navigate]);

    return children; // Render the rest of the application if the URL is valid
};

export default SpecialSymbol;