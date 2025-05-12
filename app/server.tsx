import axios from 'axios';
import CryptoJS from 'crypto-js';
import * as Crypto from 'expo-crypto';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CONSTANTS from './constants';

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


function encrypt(message: string, key: any, iv: any) {
    const encrypted = CryptoJS.AES.encrypt(message, key, { iv: iv }).toString()
    return encrypted
}

function formatDigit(digit: any) {
    let result = ''
    if (digit < 10) {
        result = `0${digit}`
    } else {
        result = `${digit}`
    }
    return result
}

async function postData(loc: any) {

    const dateObject = new Date();

    const year = dateObject.getFullYear()
    const month = formatDigit(dateObject.getMonth())
    const day = formatDigit(dateObject.getDate())
    const date = `${year}-${month}-${day}`

    const hours = formatDigit(dateObject.getHours())
    const minutes = formatDigit(dateObject.getMinutes())
    const seconds = formatDigit(dateObject.getSeconds())
    const time = `${hours}:${minutes}:${seconds}`

    const aesKey = CryptoJS.enc.Utf8.parse('');

    try {
        // generate random IV
        const iv = await getIv();
        const b64iv = convertIvToB64(iv);

        // encrypt latitude
        const encLatitude = encrypt(`${loc.coords.latitude}`, aesKey, iv);
        // encrypt longitude
        const encLongitude = encrypt(`${loc.coords.longitude}`, aesKey, iv)
        // encryp header value
        const encHeaderValue = encrypt('LocationDetailsAppAuth', aesKey, iv);

        // build request body
        const data = {
            date: date,
            locationTime: time,
            encLatitude: encLatitude,
            encLongitude: encLongitude,
            b64Iv: b64iv
        }
        // custom header
        const header = {
            'X-Custom-Header': `${encHeaderValue}:${b64iv}`,
            'Content-Type': 'application/json'
        }

        // post call
        axios.post(CONSTANTS.server_post, data, { headers: header })
            .then(response => {
                console.log(response.data)
            })
            .catch(err => {
                console.log(err)
            })
    } catch (err) {
        console.log(err)
    }
    console.log('Post is success')
}

export default function server() {

    const [location, setLocation] = useState<Location.LocationObjectCoords | undefined>();
    const [errorMsg, setErrorMsg] = useState('');

    const getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();

        // const { status: backGroundStatus } = await Location.requestBackgroundPermissionsAsync();

        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        // if (backGroundStatus === 'granted') {
        //     console.log('Background permission granted');
        // }

        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
        await postData(loc);
    };

    useEffect(() => {
        getLocation(); // initial call

        const intervalId = setInterval(() => {
            getLocation(); // updated location
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <View style={styles.container}>
            {errorMsg ? (
                <Text>{errorMsg}</Text>
            ) : location ? (
                <>
                    <Text>Latitude: {location.latitude}</Text>
                    <Text>Longitude: {location.longitude}</Text>
                </>
            ) : (
                <Text>Fetching location...</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});