import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

describe('App component', () => {

	beforeEach(() => {
		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve([])
			})
		);
	});

	test('renders heading', () => {
		render(<App />);

		const headingElement = screen.getByRole('heading', {
			name: /ToDo Liste/i
		});

		expect(headingElement).toBeInTheDocument();
	});
// Test 1
	test('neue Aufgabe hinzufügen', () => {
		render(<App />);

		const input = screen.getByRole('textbox');

		fireEvent.change(input, {
			target: { value: 'Hausaufgaben' }
		});

		expect(input.value).toBe('Hausaufgaben');

		fireEvent.click(screen.getByText('Absenden'));

		expect(fetch).toHaveBeenCalledWith(
			"http://localhost:8080/v1/tasks",
			expect.objectContaining({
				method: "POST"
			})
		);
	});

	// Test 2
	test('prüft die korrekte Anzahl von Elementen in der Aufgabenliste', async () => {
		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve([
					{ taskdescription: 'Hausaufgaben' },
					{ taskdescription: 'Einkaufen' }
				])
			})
		);

		render(<App />);
		const items = await screen.findAllByRole('listitem');
		expect(items).toHaveLength(2);
	});

	// Test 3
	test('prüft, ob der "Erledigt"-Button ein Element aus der Liste entfernt', async () => {
		global.fetch = jest.fn()
			.mockResolvedValueOnce({
				json: () => Promise.resolve([{ taskdescription: 'Hausaufgaben' }])
			})
			.mockResolvedValueOnce({});

		render(<App />);
		const button = await screen.findByText('✔');
		fireEvent.click(button);
		expect(screen.queryByText('Hausaufgaben')).not.toBeInTheDocument();
	});

	// Test 4
	test('prüft das Verhalten beim Entfernen eines Elements aus der Liste', async () => {
		global.fetch = jest.fn()
			.mockResolvedValueOnce({
				json: () => Promise.resolve([{ taskdescription: 'Hausaufgaben' }])
			})
			.mockResolvedValueOnce({});

		render(<App />);
		const button = await screen.findByText('✔');
		fireEvent.click(button);
		expect(screen.queryByText('Hausaufgaben')).not.toBeInTheDocument();
	});

	// Test 5
	test('zeigt eine Fehlermeldung, wenn ein leerer Eintrag hinzugefügt werden soll', () => {
		render(<App />);
		const input = screen.getByRole('textbox');
		fireEvent.change(input, { target: { value: '' } });
		fireEvent.click(screen.getByText('Absenden'));
		expect(screen.getByText(/Bitte gib eine Aufgabe ein/i)).toBeInTheDocument();
	});



	// Test 6
	test('zeigt eine Fehlermeldung, wenn das Laden der Aufgabenliste fehlschlägt', async () => {
		global.fetch = jest.fn(() => Promise.reject(new Error('Network Error')));

		render(<App />);
		expect(await screen.findByText(/Fehler beim Laden der Aufgabenliste/i)).toBeInTheDocument();
	});

});