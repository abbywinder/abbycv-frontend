import './components.css';
import { palette } from '../palette';

const Loading = () => {

    return (
        <div 
            className="loading-container"
            data-testid="loading-spinner"
        >
            <div 
                className="loading-spinner"
                style={{
                    border: `5px solid ${palette.accent}`,
                    borderTop: `5px solid ${palette.bg}`            
                }}
            />
        </div>
    );
};

export default Loading;