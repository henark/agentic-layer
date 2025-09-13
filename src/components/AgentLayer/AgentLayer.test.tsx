import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AgentLayer } from './AgentLayer';

// Mock the modules that are not being tested directly
jest.mock('@/lib/agent/planner');
jest.mock('@/lib/agent/executor');
jest.mock('@/lib/agent/governor');
jest.mock('@/lib/agent/cache');
jest.mock('@/lib/agent/orchestrator');

describe('AgentLayer Component', () => {
  it('should render and display verification results on submit', async () => {
    render(<AgentLayer />);

    // Check for initial state
    expect(screen.getByText('Agentic Layer with Verification')).toBeInTheDocument();
    expect(screen.getByText('No claims to verify.')).toBeInTheDocument();

    // Simulate user input
    const input = screen.getByPlaceholderText('Enter your request...');
    fireEvent.change(input, { target: { value: 'Test request with claims' } });

    // Simulate form submission
    const submitButton = screen.getByText('Send');
    fireEvent.click(submitButton);

    // Wait for the component to update with verification results
    // The mock flow in the component will run and set the state
    await waitFor(() => {
      // Check that the "No claims" message is gone
      expect(screen.queryByText('No claims to verify.')).not.toBeInTheDocument();

      // Check for the verified claim
      expect(screen.getByText('✅ VERIFIED')).toBeInTheDocument();
      expect(screen.getByText(/Claim: "2 \+ 2 = 4"/)).toBeInTheDocument();

      // Check for the failed claim
      expect(screen.getByText('❌ FAILED')).toBeInTheDocument();
      expect(screen.getByText(/Claim: "10 - 2 = 7"/)).toBeInTheDocument();
    });
  });
});
