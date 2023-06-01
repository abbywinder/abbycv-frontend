const Message = ({ children, sender }) => {
    return (
        <div 
            className={`message-container ${sender}`}
            data-testid={`message-${sender}`}
        >
            {children}
        </div>
    )
};

export default Message;