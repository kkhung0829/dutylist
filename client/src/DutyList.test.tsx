import { render, screen } from '@testing-library/react';
import DutyList from './DutyList';

test('renders DutyList component', () => {
  render(<DutyList />);

  const header = screen.getByText('Duty List');
  expect(header).toBeInTheDocument();
});