import { useState, useEffect } from 'react';
import { getChatGPTResponse } from '../../../api/chat-api';
import Typing from '../../../components/Typing';
import ChatGPTDialogHead from './ChatGPTDialogHead';
import ChatInput from './ChatInput';
import Message from './Message';
import Prompt from './Prompt';

const ChatGPTDialog = ({ lifestage }) => {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [chat, setChat] = useState([]);
    const [prompts, setPrompts] = useState([]);


    useEffect(() => {
        if (dialogOpen && !chat.length) {
            setTimeout(() => {
                setChat([{
                    sender: 'chatbot',
                    message: <Typing />,
                    status: 'loading'
                }])
            }, 500);

            setTimeout(() => {
                setChat([{
                    sender: 'chatbot',
                    message: `Ask me anything about this ${lifestage.type}`,
                    status: 'success'
                }])
                setPrompts(['What makes Abby suitable for a role that needs quick learners?',`What traits has Abby gained from this ${lifestage.type}?`,'What kind of job would Abby be a good fit for?'])
            }, 1500);
        };
    },[dialogOpen]);
    

    const getChatResponse = async (newChat, filteredPrompts) => {
        setChat(prev => [...prev, {
            sender: 'chatbot',
            message: <Typing />,
            status: 'loading'
        }]);

        const cvExcerpt = `Excerpt of CV: ${lifestage.description.toString()}. Achievements: ${lifestage.achievements.toString()}.`;
        const context = {sender: "client", message: cvExcerpt};

        const response = await getChatGPTResponse([context, ...newChat]);

        setChat(prev => prev.reduce((acc, val) => {
            if (val.status === "loading") {
                val["message"] = typeof(response) === "string" ? response : response.response;
                val["status"] = "success"
            }
            return [...acc, val]
        },[]));

        setPrompts(typeof(response) === "string" ? [] : filteredPrompts);
    };

    const handleUserChat = userReply => {
        const newChat = [...chat, {
            sender: 'client',
            message: userReply,
            status: 'success'
        }];
        setChat(newChat);
        setPrompts([]);
        getChatResponse(newChat, prompts.filter(prompt => prompt !== userReply));
    };


    if (dialogOpen) {
        return (
            <section 
                className='chat-dialog open'
                data-testid='chat-dialog-open'
            >
                <ChatGPTDialogHead setDialogOpen={setDialogOpen} />

                <section className='messages-section'>
                    {chat.map((message, i) => (
                        <Message key={i} sender={message.sender}>
                            {message.message}
                        </Message>
                    ))}

                    {prompts.map((prompt, i) => (
                        <Prompt 
                            key={i}
                            handleClick={prompt => handleUserChat(prompt)}
                        >
                            {prompt}
                        </Prompt>
                    ))}

                </section>
                <ChatInput 
                    handleSubmit={handleUserChat} 
                />
            </section>
        );
    } else {
        return (
            <section 
                className='chat-dialog'
                onClick={() => setDialogOpen(true)}
                data-testid='chat-dialog-closed'
            >
                <p className='closed-caption'>
                    Get ChatGPT's "opinion"
                </p>
                <img 
                    src={'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/240px-ChatGPT_logo.svg.png'} 
                    alt='ChatGPT logo'
                    className='logo'
                />
            </section>
        )
    }
};

export default ChatGPTDialog;