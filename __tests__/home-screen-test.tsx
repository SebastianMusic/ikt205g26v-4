
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import AuthTab from '@/components/AuthTab';
import CreateNoteScreen from '@/app/(tabs)/create_note'
import HomeScreen from '@/app/(tabs)/home'
import Auth from '@/components/Auth';
import { NoteType } from '@/utils/interface';

const mockGetClaims = jest.fn()
jest.mock('@/utils/supabase', () => ({
	supabase: {
		auth: { getClaims: () => mockGetClaims() },
		from: jest.fn().mockReturnValue({
			select: jest.fn().mockReturnValue({
				order: jest.fn().mockReturnValue({
					range: jest.fn().mockReturnValue({
						data: [{
							title: "note",
							body: "body",
							id: "123",
							image_id: null,
							created_at: "2026-03 - 11 13: 30",
							user_id: "test"
						}] as NoteType[],
						error: null
					})

				})
			})
		})
	}

}))

jest.mock('@faker-js/faker', () => ({
	faker: {
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


describe('(15%) Integration Test - Mocking & Loader:', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})
	test("", async () => {
		render(<HomeScreen />)
		const noteLoadingIndicator = screen.getByTestId("noteLoadingIndicator")
		await waitFor(() => {
			expect(noteLoadingIndicator).toBeVisible()
		})
		screen.debug()
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




