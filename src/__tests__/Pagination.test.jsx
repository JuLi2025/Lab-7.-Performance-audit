import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

vi.mock('../hooks/useReferenceData', () => ({
  useReferenceData: () => ({
    cities: [],
    regions: [],
    price: { min: 250, max: 1200, step: 50 },
    ready: true,
  }),
}));

vi.mock('../hooks/useLocalStorage', () => ({
  useLocalStorage: () => [[], () => {}],
}));

vi.mock('../components/Header', () => ({
  default: () => null,
}));

vi.mock('../components/Filters', () => ({
  default: () => null,
}));

vi.mock('../components/SearchBar', () => ({
  default: () => null,
}));

vi.mock('../components/EmptyState', () => ({
  default: () => null,
}));

vi.mock('../components/TutorDetails', () => ({
  default: () => null,
}));

vi.mock('../components/Toast', () => ({
  default: () => null,
}));

vi.mock('../components/TutorList', () => ({
  default: ({ tutors }) => (
    <div>
      {tutors.map((tutor) => (
        <div data-testid="tutor-card" key={tutor.id}>
          {tutor.name}
        </div>
      ))}
    </div>
  ),
}));

describe('Pagination', () => {
  it('відображає не більше 20 карток репетиторів на сторінці', () => {
    render(<App />);

    const cards = screen.getAllByTestId('tutor-card');

    expect(cards.length).toBeLessThanOrEqual(20);
  });
});