import { CameraCapturedPicture } from "expo-camera";
import { ImagePickerAsset, ImagePickerResult } from "expo-image-picker";
import { create } from "zustand"
import { NoteType } from "./interface";

type CounterStore = {
	count: number;
	render: number;
	getNotes: number;
	incGetNotes: () => void;
	incRender: () => void;
	decRender: () => void;
	increment: () => void;
	decrement: () => void;
};

type NoteStore = {
	notes: NoteType[]
	setNotes: (notes: NoteType[]) => void;
}

export const useNoteStore =
	create<NoteStore>((set) => ({
		notes: [],
		setNotes: (notes: NoteType[]) => {
			set((state) => ({ notes: notes }))
		}


	}))



export type PictureStore = {
	pictureRef: ImagePickerAsset | null
	pictureTaken: boolean;
	setPictureTaken: (value: boolean) => void;
	setPictureRef: (picture: ImagePickerAsset | null) => void;

}


export const useCounterStore =
	create<CounterStore>((set) => ({
		count: 0,
		render: 0,
		getNotes: 0,
		incGetNotes: () => {
			set((state) => ({ getNotes: state.getNotes + 1 }))
		},
		increment: () => {
			set((state) => ({ count: state.count + 1 }))
		},
		decrement: () => {
			set((state) => ({ count: state.count - 1 }))
		},

		incRender: () => {
			set((state) => ({ count: state.render + 1 }))
		},

		decRender: () => {
			set((state) => ({ count: state.render - 1 }))
		},


	}))


export const usePictureStore = create<PictureStore>((set) => ({
	pictureRef: null,
	pictureTaken: false,
	setPictureTaken: (bool) => {
		set(() => ({ pictureTaken: bool }))
	},
	setPictureRef: (picture) => {
		set(() => ({ pictureRef: picture }))
	}

}))
