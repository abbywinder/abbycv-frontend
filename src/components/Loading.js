import './components.css';

const Loading = () => {

    return (
        <div 
            className="loading-container"
            data-testid="loading-spinner"
        >
            <div className="loading-spinner" />
        </div>
    );
};

export default Loading;