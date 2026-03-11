
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import AuthTab from '@/components/AuthTab';
import CreateNoteScreen from '@/app/(tabs)/create_note'
import Auth from '@/components/Auth';

const mockGetClaims = jest.fn()
jest.mock('@/utils/supabase', () => ({
	supabase: {
		auth: { getClaims: () => mockGetClaims() }
	}

}))

const mockNavigate = jest.fn().mockImplementation((...args) => {
	console.log('mockNavigate called with:', args)
})
jest.mock('expo-router', () => ({
	useRouter: () => ({
		navigate: mockNavigate
	})
}))
jest.mock('react-native-keyboard-controller', () => ({
	KeyboardAwareScrollView: ({ children }: any) => children,
	KeyboardToolbar: () => null,
}))
jest.mock('react-native-safe-area-context', () => ({
	SafeAreaProvider: ({ children }: any) => children,
	SafeAreaView: ({ children }: any) => children,
}))
global.alert = jest.fn()


describe('(10%) Unit Test - Opprettelse & Navigasjon', () => {
	test("", async () => {
		mockGetClaims.mockResolvedValue({ data: { user: { id: '123' } }, error: null })
		render(<CreateNoteScreen />)
		screen.debug()
		const saveButton = screen.getByTestId('saveButton')
		fireEvent.press(saveButton)
		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('/home')
		})
	})
})


describe('Auth tab testing.', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})
	test('Test that you can not naviagate when logged out', async () => {
		mockGetClaims.mockResolvedValue({ data: null, error: 'not logged in' })
		render(<AuthTab path="/create_note" />);
		screen.debug()
		fireEvent.press(screen.root)
		await waitFor(() => {
			expect(alert).toHaveBeenCalled()
			expect(mockNavigate).not.toHaveBeenCalled()
		})

	});

	test('Test that you can navigate when logged in', async () => {
		mockGetClaims.mockResolvedValue({ data: { user: { id: '123' } }, error: null })
		const pathName = "/create_note"
		render(<AuthTab path={pathName} />);
		screen.debug()
		fireEvent.press(screen.root)
		await waitFor(() => {
			expect(alert).not.toHaveBeenCalled()
			expect(mockNavigate).toHaveBeenCalledWith(pathName)
		})
	});
});




