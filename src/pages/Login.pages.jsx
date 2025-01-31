import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import PhoneNum from "../components/Authentication/PhoneNum.comp.auth";
import { useFirebase } from "../context/firebase.context";

const LoginPage = () => {
    const firebase = useFirebase();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    if (firebase.isLoggedIn) {
        navigate("/");
    }

    const registerAcc = () => {
        navigate("/register");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("signing in");

        const result = await firebase.singInWithEmailLink(email);
    };

    return (
        <div className="container mt-5">
            <PhoneNum />
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        placeholder="Enter email"
                    />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>

            <h2 className="mt-5 mb-2">Other Methods</h2>
            <Button
                onClick={firebase.signInWithGoogle}
                variant="danger"
                type="submit"
            >
                Sign in With Google
            </Button>

            <h4 className="mt-5 mb-2">Don't have an Account?</h4>
            <Button onClick={registerAcc} variant="primary" type="submit">
                Register Account
            </Button>
            
        </div>
    );
};

export default LoginPage;
