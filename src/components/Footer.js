import { useEffect, useState } from "react";
import { icons } from "./icons";
 
const Footer = () => {

    useEffect(() => {
        if (!document.body.dataset.theme) document.body.dataset.theme = 'light';
    },[]);

    const links = [{
        link: 'www.google.com',
        icon: icons.linkedin
    }];

    const [activeTheme, setActiveTheme] = useState('light');

    const toggleTheme = () => {
        setActiveTheme(document.body.dataset.theme === 'light' ? 'dark' : 'light');
        document.body.dataset.theme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
    };
    
    return (
        <section class='footer'>
            {
                links.length ? links.map(link => (
                    <a href={link.link}>
                        {link.icon}
                    </a>
                ))
            : null}
            <aside onClick={toggleTheme}>
                {activeTheme && activeTheme === 'light' ? icons.moon : icons.sun}
            </aside>
        </section>
    );
};

export default Footer;