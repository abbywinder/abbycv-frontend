import './components.css';
import { palette } from '../palette';


const Tag = ({children, i, testName}) => {

    return (
        <li 
            className="tag"
            data-testid={testName}
            role="button" 
            aria-pressed="false"
            tabIndex={i} 
            style={{
                backgroundColor: palette.accent
            }}
        >
            <span>
                {children}
            </span>
        </li>
    );
};

export default Tag;