import React, { useState } from "react";
import { View, Modal } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function GeoLocationModal({
  geoLocationModal,
  setGeoLocationModal,
  marker,
  setMarker,
}) {
  return (
    <Modal
      onRequestClose={() => setGeoLocationModal(false)}
      animationType="slide"
      transparent={false}
      visible={geoLocationModal}
    >
      <View className="h-full py-6 px-8 flex-1 justify-center items-center">
        <MapView
          showsUserLocation={true}
          followsUserLocation={false}
          onPress={async (e) => {
            await setMarker({ ...e.nativeEvent.coordinate });
            setGeoLocationModal(false);
          }}
          style={{ width: "100%", height: "100%", flex: 1 }}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 28.68676050293644,
            longitude: 77.20994857560468,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {marker.latitude != "" && marker.longitude != "" && (
            <Marker coordinate={{ ...marker }} title={"Add Location"} />
          )}
        </MapView>
      </View>
    </Modal>
  );
}
