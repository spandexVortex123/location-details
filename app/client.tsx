import axios from "axios";
import CryptoJS from 'crypto-js';
import * as Crypto from 'expo-crypto';
import isEqual from 'lodash.isequal';
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import CONSTANTS from "./constants";

const mode = 'aes-256-cbc';

async function getIv() {
    const byteArray = await Crypto.getRandomBytesAsync(16); // 16 bytes = 128-bit IV

    // Convert byte array to WordArray (CryptoJS format)
    const wordArray = CryptoJS.lib.WordArray.create(byteArray);
    return wordArray;
}

function convertIvToB64(iv: any) {
    return iv.toString(CryptoJS.enc.Base64);
}

function decodeB64ToIv(base64Str: string) {
    return CryptoJS.enc.Base64.parse(base64Str); // returns WordArray
}

function encrypt(message: string, key: any, iv: any) {
    const encrypted = CryptoJS.AES.encrypt(message, key, { iv: iv }).toString()
    return encrypted
}

function decrypt(cipherTextB64: string, key: any, iv: any): string {
    const decrypted = CryptoJS.AES.decrypt(cipherTextB64, key, { iv: iv });
    return decrypted.toString(CryptoJS.enc.Utf8); // convert WordArray to string
}

export default function client() {
    const lat = 12.976667;
    const longi = 77.599192;

    const [location, setLocation] = useState({locationTime: '', latitude: '', longitude: ''});

    const aesKey = CryptoJS.enc.Utf8.parse('');

    // Store the previous value in a ref to avoid unnecessary state updates
    const previousDataRef = useRef({locationTime: '', latitude: '', longitude: ''});

    const fetchData = async () => {
        try {

            // setup header
            const iv = await getIv();
            const b64iv = convertIvToB64(iv);
            const encHeaderValue = encrypt('LocationDetailsAppAuth', aesKey, iv);
            // custom header
            const header = {
                'X-Custom-Header': `${encHeaderValue}:${b64iv}`,
                'Content-Type': 'application/json'
            }
            console.log('calling api')
            const response = await axios.get(CONSTANTS.server_get, { headers: header, timeout: 10000 })
            const newData = response.data;

            const locationTime = newData.data.locationTime;
            const b64ivResponse = newData.data.b64Iv;
            const ivResponse = decodeB64ToIv(b64ivResponse);
            const encLatitude = newData.data.encLatitude;
            const encLongitude = newData.data.encLongitude;

            // decrypt data
            const decLatitude = decrypt(encLatitude, aesKey, ivResponse);
            const decLongitude = decrypt(encLongitude, aesKey, ivResponse);

            const locationObject = {
                latitude: decLatitude,
                longitude: decLongitude,
                locationTime: locationTime
            }

            console.log(locationObject)

            if (!isEqual(locationObject, previousDataRef.current)) {
                setLocation(locationObject)
                previousDataRef.current = locationObject
            }

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchData(); // initial call

        const intervalId = setInterval(() => {
            fetchData();
        }, 10000);

        return () => clearInterval(intervalId); // cleanup
    }, [])

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE} // 👈 Use Google Maps
                style={styles.map}
                initialRegion={{
                    latitude: 13.072866280532375, 
                    longitude: 77.56057694422432,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                <Marker
                    coordinate={{ latitude: Number(location.latitude), longitude: Number(location.longitude) }}
                    title={`Location at ${location.locationTime}`}
                />
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
});