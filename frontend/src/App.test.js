	import { render, screen, fireEvent } from '@testing-library/react';
	import App from './App';
	
	describe('App component', () => {
	
		/**
		* Testet das Rendern der Überschrift.
		*/
		test('renders heading', () => {
			render(<App />);
			const headingElement = screen.getByRole('heading', { name: /ToDo Liste/i });
			expect(headingElement).toBeInTheDocument();
		});
		
		/**
		* Testet das Hinzufügen einer Aufgabe.
		*/
		test('allows user to add a new task', () => {
			render(<App />);
			const inputElement = screen.getByLabelText(/Neue Aufgabe hinzufügen/i);
			const addButtonElement = screen.getByRole('button', { name: /Hinzufügen/i });
			const taskName = 'Buy groceries';
			fireEvent.change(inputElement, { target: { value: taskName } });
			fireEvent.click(addButtonElement);
			const newTaskElement = screen.getByText('Buy groceries');
			expect(newTaskElement).toBeInTheDocument();
		});
	
});
