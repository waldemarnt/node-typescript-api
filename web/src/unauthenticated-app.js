/** @jsx jsx */
/** @jsxFrag React.Fragment **/
import React, { useState } from "react";
import { jsx } from "@emotion/core";

import { useAuth } from "./context/auth-context";
import { useAsync } from "./utils/use-async";

import {AppTitle,ArrowRight, Wrapper, FormField, Logo, PrimaryButton, SubtleButton, ErrorMessage} from "./components/misc";

function Form({ type, onSubmit, submitButton }) {
  const { isLoading, isError, error, run } = useAsync();
  function handleSubmit(event) {
    event.preventDefault();
    const { username = { value: ''}, email, password } = event.target.elements;
    
    run(
      onSubmit({
        name: username.value,
        password: password.value,
        email: email.value,
      })
    );
  }

  return (
    <form 
        onSubmit={handleSubmit}
        css={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          minHeight: '350px',
        }}
    >
      { type === 'register' && (<FormField theme="login" label="Username" id="username" type="text" name="username" />)}
      <FormField theme="login" label="Email" id="email" type="email" name="email" required={true} />
      <FormField theme="login" label="Password" id="password" type="password" name="password" required={true} />
      <div css={{marginTop: 'auto', marginBottom: '1em'}}>
        {React.cloneElement(
          submitButton,
          { type: "submit", isLoading },
          ...(Array.isArray(submitButton.props.children)
            ? submitButton.props.children
            : [submitButton.props.children]),
        )}
      </div>
      {isError && <ErrorMessage error={error} />}
    </form>
  );
}

function UnauthenticatedApp() {
  const [activeForm, setActiveForm] = useState('login');
  const { login, register } = useAuth();

  return (
    <Wrapper styles={{
      minWidth: '20em',
      maxWidth: '90%',
      paddingTop: '5em',
    }}>
      <Logo styles={{position: 'absolute', top: '0', transform: 'translate(-50%, -50%)'}} />
      <AppTitle />
      { activeForm === 'login'
        ? (
          <>
            <Form type='login' onSubmit={login} submitButton={<PrimaryButton>Login <ArrowRight /></PrimaryButton>} />
            <SubtleButton onClick={() => setActiveForm('register')}>create an account</SubtleButton>
          </>
        ) : (
          <>
            <Form type='register' onSubmit={register} submitButton={<PrimaryButton>Register</PrimaryButton>} />
            <SubtleButton onClick={() => setActiveForm('login')}>sign in</SubtleButton>
          </>
        )
      }
    </Wrapper>
  );
}

export default UnauthenticatedApp;
