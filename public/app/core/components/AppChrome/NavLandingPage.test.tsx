import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import { config } from '@grafana/runtime';
import { configureStore } from 'app/store/configureStore';

import { NavLandingPage } from './NavLandingPage';

describe('NavLandingPage', () => {
  const mockSectionTitle = 'Section title';
  const mockId = 'section';
  const mockSectionUrl = 'mock-section-url';
  const mockSectionSubtitle = 'Section subtitle';
  const mockChild1 = {
    text: 'Child 1',
    description: 'Child 1 description',
    id: 'child1',
    url: 'mock-section-url/child1',
  };
  const mockChild2 = {
    text: 'Child 2',
    description: 'Child 2 description',
    id: 'child2',
    url: 'mock-section-url/child2',
  };
  const mockChild3 = {
    text: 'Child 3',
    id: 'child3',
    subTitle: 'Child 3 subtitle',
    url: 'mock-section-url/child3',
    hideFromTabs: true,
    children: [
      {
        text: 'Child 3.1',
        description: 'Child 3.1 description',
        id: 'child3.1',
        url: 'mock-section-url/child3/child3.1',
      },
    ],
  };

  const setup = () => {
    config.bootData.navTree = [
      {
        text: mockSectionTitle,
        id: mockId,
        url: mockSectionUrl,
        subTitle: mockSectionSubtitle,
        children: [mockChild1, mockChild2, mockChild3],
      },
    ];

    const store = configureStore();
    return render(
      <Provider store={store}>
        <NavLandingPage navId={mockId} />
      </Provider>
    );
  };

  it('uses the section text as a heading', () => {
    setup();
    expect(screen.getByRole('heading', { name: mockSectionTitle })).toBeInTheDocument();
  });

  it('renders the section subtitle', () => {
    setup();
    expect(screen.getByText(mockSectionSubtitle)).toBeInTheDocument();
  });

  it('renders a link for each direct child', () => {
    setup();
    expect(screen.getByRole('link', { name: mockChild1.text })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: mockChild2.text })).toBeInTheDocument();
  });

  it('renders the description for each direct child', () => {
    setup();
    expect(screen.getByText(mockChild1.description)).toBeInTheDocument();
    expect(screen.getByText(mockChild2.description)).toBeInTheDocument();
  });

  it('renders the heading for nested sections', () => {
    setup();
    expect(screen.getByRole('heading', { name: mockChild3.text })).toBeInTheDocument();
  });

  it('renders the subTitle for a nested section', () => {
    setup();
    expect(screen.getByText(mockChild3.subTitle)).toBeInTheDocument();
  });

  it('renders a link for a nested child', () => {
    setup();
    expect(screen.getByRole('link', { name: mockChild3.children[0].text })).toBeInTheDocument();
  });

  it('renders the description for a nested child', () => {
    setup();
    expect(screen.getByText(mockChild3.children[0].description)).toBeInTheDocument();
  });
});
