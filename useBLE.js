import { BleManager } from "react-native-ble-plx";
import { PermissionsAndroid,Platform } from "react-native";

class BLEAPI {
    constructor(){
        this.manager = new BleManager();
        this.scanned_devices = {};

    }

    scanAndConnect(devices,setDevices) {
        this.manager.startDeviceScan(null,null, (error, device) => {
          if (error) {
            // Handle error (scanning will be stopped automatically)
            console.log(error);
            return flase
          }

      
          // Check if it is a device you are looking for based on advertisement data
          // or other criteria.
        this.scanned_devices[device.localName]=device.rssi;
        setDevices([device.name]);
        console.log(this.scanned_devices);
        })
        
      }

    async checkPermissions(){
        // Check permissions for BLE functionality
    if (Platform.OS === 'ios') {
        return true; // iOS does not require explicit permissions for BLE
      }
  
      if (Platform.OS === 'android') {
        const apiLevel = parseInt(Platform.Version, 10);
  
        if (apiLevel < 31) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          const result = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          ]);
  
          return (
            result['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
            result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
            result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
          );
        }
      }
  
      return false; // Default to false if permissions are not granted
    }

    
}
export function rssiToDistance(rssi) {
  // Example empirical formula
  // This formula is just a placeholder and may need calibration based on real-world measurements
  // RSSI = A - 10 * n * log(distance), where A is the RSSI at 1 meter, n is the path-loss exponent
  const A = -56; // RSSI at 1 meter
  const n = 6; // Path-loss exponent

  // Calculate distance using the inverse path-loss model
  const distance = Math.pow(10, ((A - rssi) / (10 * n)));

  return distance;
}

export function kalmanFilter(rssi){

}

export default BLEAPI;