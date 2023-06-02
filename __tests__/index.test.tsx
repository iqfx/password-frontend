import { UserProvider } from '@auth0/nextjs-auth0/client';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Home from '../src/pages/index'

test('renders learn react link', async () => {
    await act(async () => {
        render(
            <UserProvider>
                <Home />
            </UserProvider>
            )
    });

    const linkElement = screen.getByTestId('profileItem');
    expect(linkElement).toBeInTheDocument();
});
