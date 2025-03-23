import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpaceBetween, Form, FormField, Input, Button, Alert, Link, Box } from '@cloudscape-design/components';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate form fields
        if (!email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            // Use the proxy URL
            const apiUrl = isAdmin
                ? '/api/auth/admin/signup' // Proxy will forward this to the actual API
                : '/api/auth/employee/signup';

            console.log('Attempting to reach API endpoint:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create account. Please try again.');
            }

            const data = await response.json();
            console.log('Response data:', data);

            // Redirect to login page on success
            navigate('/login');
        } catch (err) {
            console.error('Detailed signup error:', err);
        
            // Narrow the type of `err` to access `err.message`
            if (err instanceof Error) {
                setError(err.message || 'Failed to create account. Please try again.');
            } else {
                setError('Failed to create account. Please try again.');
            }
        }finally {
            setLoading(false);
        }
    };

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
            <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%' }}>
                <Box padding="xl" variant="div">
                    {/* Admin/Employee Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
                        <Button variant={isAdmin ? 'primary' : 'link'} onClick={() => setIsAdmin(true)}>
                            Admin
                        </Button>
                        <Button variant={!isAdmin ? 'primary' : 'link'} onClick={() => setIsAdmin(false)}>
                            Employee
                        </Button>
                    </div>

                    {/* Centered Header */}
                    <Box textAlign="center" margin={{ bottom: 'l' }} fontSize="heading-xl" fontWeight="bold">
                        {isAdmin ? 'Admin Signup' : 'Employee Signup'}
                    </Box>

                    {/* Signup Form */}
                    <form onSubmit={handleSubmit}>
                        <SpaceBetween size="l">
                            {error && <Alert type="error">{error}</Alert>}
                            <Form>
                                <SpaceBetween size="l">
                                    <FormField label="Email">
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={({ detail }) => setEmail(detail.value)}
                                            placeholder="Enter your email"
                                        />
                                    </FormField>
                                    <FormField label="Password">
                                        <Input
                                            type="password"
                                            value={password}
                                            onChange={({ detail }) => setPassword(detail.value)}
                                            placeholder="Enter your password"
                                        />
                                    </FormField>
                                    <FormField label="Confirm Password">
                                        <Input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={({ detail }) => setConfirmPassword(detail.value)}
                                            placeholder="Confirm your password"
                                        />
                                    </FormField>
                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                        <Button variant="primary" formAction="submit" loading={loading}>
                                            Sign Up
                                        </Button>
                                    </div>
                                    <Box textAlign="center">
                                        <span>Already Have Account? </span>
                                        <Link onFollow={handleLogin}>Login</Link>
                                    </Box>
                                </SpaceBetween>
                            </Form>
                        </SpaceBetween>
                    </form>
                </Box>
            </div>
        </div>
    );
};

export default Signup;