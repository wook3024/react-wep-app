import React, { lazy } from "react";

const LoginForm = lazy(() => import("../components/loginform"));

const SignIn = () => {
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default SignIn;
