import { useEffect, useState } from "react";
import { icons } from "./icons";
 
const Footer = () => {

    useEffect(() => {
        if (!document.body.dataset.theme) document.body.dataset.theme = 'light';
    },[]);

    const links = [{
        link: 'https://www.linkedin.com/in/abby-winder-38bb669a/',
        icon: icons.linkedin
    }, {
        link: 'https://github.com/abbywinder',
        icon: icons.github
    }, 
    // {
    //     link: 'https://cv-images-12.s3.eu-west-1.amazonaws.com/Abby+Winder+CV.pdf',
    //     icon: icons.cv
    // }
    ];

    const [activeTheme, setActiveTheme] = useState('light');

    const toggleTheme = () => {
        setActiveTheme(document.body.dataset.theme === 'light' ? 'dark' : 'light');
        document.body.dataset.theme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
    };
    
    return (
        <section className='footer'>
            <div className='links'>
                {
                    links.length ? links.map(link => (
                        <a 
                            key={link.link} 
                            href={link.link}
                            target="_blank"
                        >
                            {link.icon}
                        </a>
                    ))
                : null}
            </div>
            <button onClick={toggleTheme}>
                {activeTheme && activeTheme === 'light' ? icons.moon : icons.sun}
            </button>
        </section>
    );
};

export default Footer;