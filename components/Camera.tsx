import { View, Button } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { CameraView, CameraType, useCameraPermissions, Camera, CameraCapturedPicture } from 'expo-camera';
import { Image } from 'expo-image';
import { usePictureStore } from '@/utils/store';


export default function SebbeCamera() {
	const pictureStore = usePictureStore()
	const [facing, setFacing] = useState<CameraType>('back');

	const [permission, requestPermission] = useCameraPermissions();
	const cameraRef = useRef<CameraView | null>(null)

	function takePictureAsync() {
		if (!cameraRef.current) return
		cameraRef.current.takePictureAsync().then((picture) => {
			pictureStore.setPictureRef(picture)
			pictureStore.setPictureTaken(true)
		});
	}

	return (
		<View style={{ flex: 1 }}>
			{permission?.granted && <CameraView ref={cameraRef} facing={facing} style={{ flex: 1 }} />}
			{!permission && <Button onPress={requestPermission} title="tillat kamera" />}
			<Button title="Ta bilde" onPress={takePictureAsync} />


			{
				// <Image style={{ flex: 1 }} source={pictureRef} contentFit='cover' />
			}
		</View>

	)


}
