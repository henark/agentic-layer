import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AgentLayer } from './AgentLayer';

// Mock the modules that are imported by the component
// We can provide mock implementations to control their behavior in tests
jest.mock('@/lib/agent/planner', () => ({
  TaskPlanner: jest.fn().mockImplementation(() => ({
    decomposeTask: jest.fn().mockResolvedValue([
      { id: 'task1', description: 'Test Task 1', status: 'pending' },
    ]),
    prioritizeTasks: jest.fn(tasks => Promise.resolve(tasks)),
  })),
}));

jest.mock('@/lib/agent/orchestrator', () => ({
  AgentOrchestrator: jest.fn().mockImplementation(() => ({
    executeTasks: jest.fn().mockResolvedValue({
      taskResults: { task1: { output: 'Result for task 1' } },
      verificationResults: [
        {
          claim: { statement: '2 + 2 = 4' },
          isVerified: true,
          evidence: 'Evaluation result: true',
        },
      ],
    }),
  })),
}));

jest.mock('@/lib/agent/governor', () => ({
  EthicalGuardrails: jest.fn().mockImplementation(() => ({
    checkRequest: jest.fn().mockResolvedValue({ allowed: true }),
  })),
}));

jest.mock('@/lib/agent/cache', () => ({
  AgentCache: jest.fn().mockImplementation(() => ({})),
}));
jest.mock('@/lib/agent/executor', () => ({
  ToolExecutor: jest.fn().mockImplementation(() => ({})),
}));


describe('AgentLayer Component', () => {
  it('should render, accept input, and display results from mocked modules', async () => {
    render(<AgentLayer />);

    // Simulate user input and form submission
    const input = screen.getByPlaceholderText('Enter your request...');
    fireEvent.change(input, { target: { value: 'plan a trip' } });
    fireEvent.click(screen.getByText('Send'));

    // Wait for the UI to update based on the mocked orchestrator response
    await waitFor(() => {
      // Check that the planned task is displayed
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    // Another wait for the final state update after execution
    await waitFor(() => {
        // Check that the verification result is displayed
        expect(screen.getByText('✅ VERIFIED')).toBeInTheDocument();
        expect(screen.getByText(/Claim: "2 \+ 2 = 4"/)).toBeInTheDocument();
    });
  });
});
