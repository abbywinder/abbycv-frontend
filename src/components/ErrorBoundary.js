import React from 'react';
// import { sendErrorLog } from '../utilities/api-helpers/logsAPI';

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
    //   sendErrorLog(error + ' -------- ' + errorInfo, 'Error boundary', 'n/a');
    }
  
    render() {
      if (this.props.hasError) {
        // You can render any custom fallback UI
        return <h1>Something went wrong.</h1>
      }
  
      return this.props.children; 
    }
};

export default ErrorBoundary;