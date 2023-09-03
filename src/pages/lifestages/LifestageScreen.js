import { Fragment } from 'react'
import { redirect, useParams } from 'react-router-dom';
import { useOneLifestage } from '../../api/queries';
import { ErrorBoundary } from 'react-error-boundary';
import { capitalize, checkAuth } from '../../utils/functions';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import Tag from '../../components/Tag';
import ChatGPTDialog from './chatGPTDialog/ChatGPTDialog';
import ErrorPage from '../../components/ErrorPage';
import './lifestage.css';

const LifestageScreen = () => {

    const authorized = checkAuth();
    const { stageId } = useParams();

    const { data: lifestage, isLoading, isError } = useOneLifestage(stageId);

    if (!authorized) redirect('/login');

    if (isLoading) {
        return <Loading />
    };

    const showSkillsSection = lifestage && lifestage.hard_skills.length || lifestage.soft_skills.length;

    return (
        <ErrorBoundary FallbackComponent={ErrorPage}>
            <Header />
            <div 
                className='container'
                style={{
                    backgroundColor: showSkillsSection 
                    ? 'auto' 
                    : document.body.dataset.theme === 'light' 
                        ? lifestage.background_col 
                        : 'inherit'
                }}
            >
                <section 
                    id='title' 
                    data-testid='title'
                    style={{backgroundColor: document.body.dataset.theme === 'light' ? lifestage.background_col : 'inherit'}}
                >
                    <h1>
                        {lifestage.title.slice(12)}
                    </h1>
                    <h2>
                        {lifestage.date_start.slice(0,4)} - {lifestage.date_end.slice(0,4)}
                    </h2>
                </section>
                
                <section 
                    className='desc-img-container'
                    style={{backgroundColor: document.body.dataset.theme === 'light' ? lifestage.background_col : 'inherit'}}
                >
                    <div data-testid='description'>
                        {lifestage.description && lifestage.description.map((paragraph,i) => (
                            <p key={i}>
                                {paragraph}
                            </p>
                        ))}

                        {lifestage.achievements && lifestage.achievements.length ?
                            <Fragment>
                                <h3>
                                    Achievements
                                </h3>
                                <ul>
                                    {lifestage.achievements.map(achievement => (
                                        <li 
                                            key={achievement}
                                            className={'achievement-list'}
                                        >
                                            {achievement}
                                        </li>
                                    ))}
                                </ul>
                            </Fragment>
                        : null}
                    </div>

                    {lifestage.images.length ?
                        <div 
                            data-testid='images'
                            className='image-container'
                        >
                            {lifestage.images.map(media => {
                                return media.slice(-3) === 'mp4'
                                ? <video 
                                    key={media}
                                    width="1600" 
                                    height="545" 
                                    controls
                                    className="videos"
                                   >
                                    <source 
                                        src={media} 
                                        type="video/mp4" 
                                    />
                                  </video>
                                : <img 
                                    key={media}
                                    src={media} 
                                    className="images"
                                    alt={`Examples of ${lifestage.title}`}
                                />
                            })}
                        </div>
                    : null}
                </section>

                {showSkillsSection ?
                    <section 
                        data-testid='skills'
                        className='skills-container'
                    >
                        {['hard_skills','soft_skills'].map(skill_cat => (
                            lifestage[skill_cat] && lifestage[skill_cat].length ?
                                <div key={skill_cat}>
                                    <h3 className="skill-heading">
                                        {capitalize(skill_cat.replace('_',' '))}
                                    </h3>
                                    <div>
                                        {lifestage[skill_cat].map(e => (
                                            <Tag 
                                                key={e}
                                                disableHover
                                            >
                                                {e}
                                            </Tag>
                                        ))}
                                    </div>
                                </div>
                            : null
                        ))}
                    </section>
                : null}
                <ChatGPTDialog 
                    lifestage={lifestage}
                />
            </div>
        </ErrorBoundary>
    );
};

export default LifestageScreen;