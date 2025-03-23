import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpaceBetween, Form, FormField, Input, Button, Alert, Box, Link } from '@cloudscape-design/components';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }
        
        setLoading(true);
        
        try {
            if (isAdmin) {
                // Using the proxy URL for admin login
                const apiUrl = '/api/auth/admin/login';
                
                console.log('Attempting admin login at API endpoint:', apiUrl);
                
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                });
                
                console.log('Response status:', response.status);
                const data = await response.json();
                console.log('Response data:', data);
                
                if (response.ok) {
                    // Store authentication token and user role
                    localStorage.setItem('userToken', data.token || '');
                    localStorage.setItem('userRole', 'admin');
                    navigate('/admin/dashboard');
                } else {
                    setError(data.message || 'Invalid credentials. Please try again.');
                }
            } else {
                // Employee login using the provided API endpoint
                const employeeApiUrl = '/api/auth/employee/login';
                
                console.log('Attempting employee login at API endpoint:', employeeApiUrl);
                
                const response = await fetch(employeeApiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                });
                
                console.log('Response status:', response.status);
                const data = await response.json();
                console.log('Response data:', data);
                
                if (response.ok) {
                    // Store authentication token and user role
                    localStorage.setItem('userToken', data.token || '');
                    localStorage.setItem('userRole', 'employee');
                    navigate('/employee/dashboard');
                } else {
                    setError(data.message || 'Invalid credentials. Please try again.');
                }
            }
        } catch (err) {
            console.error('Login error:', err);
            if (err instanceof TypeError && err.message === 'Failed to fetch') {
                setError('Network error. Please check your internet connection or the API endpoint may be unavailable.');
            } else {
                setError('Failed to login. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = () => {
        navigate('/signup');
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh',
            backgroundColor: '#f0f0f0'
        }}>
            <div style={{ 
                backgroundColor: '#fff', 
                padding: '30px', 
                borderRadius: '8px', 
                boxShadow: '0px 4px 6px rgba(0,0,0,0.1)', 
                maxWidth: '400px', 
                width: '100%' 
            }}>
                <Box padding="xl" variant="div">
                    {/* Admin/Employee Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
                        <Button variant={isAdmin ? "primary" : "link"} onClick={() => setIsAdmin(true)} >Admin</Button>
                        <Button variant={!isAdmin ? "primary" : "link"} onClick={() => setIsAdmin(false)}>Employee</Button>
                    </div>

                    {/* Centered Header */}
                    <Box textAlign="center" margin={{ bottom: "l" }} fontSize="heading-xl" fontWeight="bold">
                        {isAdmin ? "Admin Login" : "Employee Login"}
                    </Box>

                    {/* Login Form */}
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
                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                        <Button variant="primary" formAction="submit" loading={loading}>
                                            Sign In
                                        </Button>
                                    </div>
                                </SpaceBetween>
                            </Form>
                        </SpaceBetween>
                    </form>
                </Box>
            </div>
        </div>
    );
};

export default Login;