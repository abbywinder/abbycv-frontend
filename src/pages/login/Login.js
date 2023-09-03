import { useEffect, useState } from "react";
import { getPublicKey, postLoginCredentials } from "../../api/login-api";
import { validationErrors } from "../constants";
import Loading from "../../components/Loading";
import './login.css';

const Login = () => {

    const [submitted, setSubmitted] = useState(false);
    const [credError, setCredError] = useState(false);
    const [username, onChangeUsername] = useState('');
    const [password, onChangePassword] = useState('');
    const [validationError, setValidationError] = useState(null);

    useEffect(() => {
        getPublicKey();
    },[]);

    const handleInput = (input, field) => {
        const regex = /^[A-Za-z0-9 ._~()'!*:@,;+?-]*$/;
        if (regex.test(input) && input.length <= 30) {
            field === 'username' ? onChangeUsername(input) : onChangePassword(input);
            setValidationError(null);
        } else {
            const errorType = regex.test(input) ? validationErrors.tooLong : validationErrors.bad;
            setValidationError(errorType);
        };
    };

    const submitForm = async () => {
        setSubmitted(true);
        const response = await postLoginCredentials(username, password);
        if (response) {
            window.location.assign('/');
            setCredError(false);
        } else {
            setCredError(true);
            onChangeUsername('');
            onChangePassword('');
            setSubmitted(false);
        }
    };

    if (submitted) return <Loading />

    return (
        <div className='login-container'>
            <h1 className="heading-text">
                Please enter credentials to proceed...
            </h1>

            {credError ?
                <aside className='cred-error'>
                    <span>
                        Incorrect username or password
                    </span>
                </aside>
            : null}

            <div className="login-input-container">
                <input
                    id='username'
                    data-testid='username-input'
                    className='credential-input'
                    type='text' 
                    value={username}
                    role='search'
                    placeholder='Enter username...'
                    autoComplete='false'
                    onChange={e => handleInput(e.target.value, 'username')}
                />

                <input
                    id='password'
                    className='credential-input'
                    data-testid='password-input'
                    type='password' 
                    role='search'
                    value={password}
                    placeholder='Enter password...'
                    autoComplete='false'
                    onChange={e => handleInput(e.target.value, 'password')}
                />
            </div>

            {validationError ?
                <aside className='cred-error'>
                    <span>
                        {validationError}
                    </span>
                </aside>
            : null}

            <button 
                className={`submit${!(username && password) || validationError ? ' disabled' : ''}`}
                onClick={submitForm}
                disabled={!(username && password) || validationError}
            >
                Submit
            </button>
        </div>
    )
};

export default Login;