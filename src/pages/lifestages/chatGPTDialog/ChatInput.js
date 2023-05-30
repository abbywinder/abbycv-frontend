import { useState } from 'react';

const ChatInput = ({ handleSubmit }) => {
    const [text, onChangeText] = useState('');

    const submitText = value => {
        handleSubmit(value);
        onChangeText('');
    };

    return (
        <section className='input-container'>
            <input
                id='chat-input'
                className='chat-input'
                type='text' 
                placeholder='Type here...'
                value={text}
                autoComplete='false'
                onChange={e => onChangeText(e.target.value)}
                onSubmit={e => submitText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' ? submitText(e.target.value) : null}
                aria-label='chat-input'
            />
            <button 
                className='chat-submit' 
                aria-label='submit'
                type='submit'
                onClick={() => submitText(text)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-send">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            </button>
        </section>
    )
};

export default ChatInput;