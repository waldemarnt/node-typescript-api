/** @jsx jsx */
/** @jsxFrag React.Fragment **/
import React, { useState } from 'react';
import { jsx } from '@emotion/core';

import { useAuth } from './context/auth-context';
import { useAsync } from './utils/use-async';

import {
  Button,
  formLoginStyles,
  Cover,
  Field,
  Flag,
  SubtleButton,
  UnAuthenticatedLogo,
  UnAuthenticatedWrapper,
} from './components/lib';

function Form({ type, onSubmit, submitButton }) {
  const { isLoading, isError, error, run } = useAsync();
  function handleSubmit(event) {
    event.preventDefault();
    const { username = { value: '' }, email, password } = event.target.elements;

    run(
      onSubmit({
        name: username.value,
        password: password.value,
        email: email.value,
      })
    );
  }

  return (
    <form onSubmit={handleSubmit} autoComplete="off" css={formLoginStyles}>
      {type === 'register' && <Field label="Username" type="text" />}
      <Field label="Email" type="email" />
      <Field label="Password" type="password" />
      {React.cloneElement(
        submitButton,
        { type: 'submit', isLoading, disabled: isLoading },
        ...(Array.isArray(submitButton.props.children)
          ? submitButton.props.children
          : [submitButton.props.children])
      )}
      {isError && <Flag type="error" message={error.message} />}
    </form>
  );
}

function UnauthenticatedApp() {
  const [isLoginActive, setLoginActive] = useState(true);
  const { login, register } = useAuth();

  return (
    <Cover>
      <UnAuthenticatedWrapper>
        <UnAuthenticatedLogo />
        {isLoginActive ? (
          <>
            <Form
              type="login"
              onSubmit={login}
              submitButton={<Button>Login</Button>}
            />
            <SubtleButton handleOnClick={() => setLoginActive(false)}>
              Create an account
            </SubtleButton>
          </>
        ) : (
          <>
            <Form
              type="register"
              onSubmit={register}
              submitButton={<Button>Register</Button>}
            />
            <SubtleButton handleOnClick={() => setLoginActive(true)}>
              Sign in
            </SubtleButton>
          </>
        )}
      </UnAuthenticatedWrapper>
    </Cover>
  );
}

export default UnauthenticatedApp;
