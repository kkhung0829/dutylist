import { render, screen } from '@testing-library/react';
import DutyList from './DutyList';

test('renders DutyList component', () => {
  render(<DutyList />);
  const addButton = screen.getByText('Add Duty');
  expect(addButton).toBeInTheDocument();
});