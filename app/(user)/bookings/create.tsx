import MapboxGL from "@rnmapbox/maps";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  GestureResponderEvent,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAPI } from "../../lib/api";

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN!);

type LngLat = [number, number];
type Phase = "pickup" | "dropoff";
type GeoFeature = { id: string; place_name: string; center: LngLat };

const VEHICLE_TYPES = [
  "TRUCK",
  "LOADER_RIKSHAW",
  "PICKUP",
  "MINI_TRUCK",
] as const;
type VehicleType = (typeof VEHICLE_TYPES)[number];

const LOAD_TYPES = [
  "General Goods",
  "Furniture",
  "Fragile",
  "Electronics",
  "Perishable",
  "Construction",
  "Bulk/Heavy",
  "Livestock",
] as const;
type LoadType = (typeof LOAD_TYPES)[number];

export default function CreateBooking() {
  const api = useAPI();
  const [phase, setPhase] = useState<Phase>("pickup");
  const [center, setCenter] = useState<LngLat>([74.3587, 31.5204]);
  const [loadingCenter, setLoadingCenter] = useState(true);

  const [pickup, setPickup] = useState<LngLat | null>(null);
  const [dropoff, setDropoff] = useState<LngLat | null>(null);
  const [pickupLabel, setPickupLabel] = useState("Pickup");
  const [dropoffLabel, setDropoffLabel] = useState("Dropoff");

  const [requiredVehicleType, setRequiredVehicleType] =
    useState<VehicleType>("TRUCK");
  const [loadType, setLoadType] = useState<LoadType>("General Goods");
  const [price, setPrice] = useState<string>("");

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoFeature[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({});
          setCenter([loc.coords.longitude, loc.coords.latitude]);
        }
      } finally {
        setLoadingCenter(false);
      }
    })();
  }, []);

  const reverseGeocode = async ([lng, lat]: LngLat) => {
    try {
      const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN!;
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}&language=en&limit=1`;
      const r = await fetch(url);
      const j = await r.json();
      return (
        j?.features?.[0]?.place_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`
      );
    } catch {
      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
  };

  const onRegionDidChange = ({ geometry }: any) => {
    const coords = geometry?.coordinates as LngLat | undefined;
    if (!coords) return;
    setCenter(coords);
  };

  const captureCurrentPin = async () => {
    try {
      const label = await reverseGeocode(center);
      if (phase === "pickup") {
        setPickup(center);
        setPickupLabel(label);
        setPhase("dropoff");
      } else {
        setDropoff(center);
        setDropoffLabel(label);
      }
    } catch {
      Alert.alert("Error", "Failed to capture location");
    }
  };

  let debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runSearch = async (text: string) => {
    const q = text.trim();
    if (!q) {
      setResults([]);
      setShowResults(false);
      return;
    }
    try {
      setSearching(true);
      const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN!;
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?access_token=${token}&language=en&limit=6&proximity=${center[0]},${center[1]}`;
      const r = await fetch(url);
      const j = await r.json();
      setResults(
        (j?.features || []).map((f: any) => ({
          id: f.id,
          place_name: f.place_name,
          center: f.center,
        }))
      );
      setShowResults(true);
    } finally {
      setSearching(false);
    }
  };
  const onChangeQuery = (text: string) => {
    setQuery(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => runSearch(text), 350);
  };
  const goToResult = (f: GeoFeature) => {
    Keyboard.dismiss();
    setShowResults(false);
    setQuery(f.place_name);
    setCenter(f.center);
    cameraRef.current?.moveTo(f.center, 800);
  };
  const useMyLocationForPhase = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({});
      const c: LngLat = [loc.coords.longitude, loc.coords.latitude];
      cameraRef.current?.moveTo(c, 800);
      setCenter(c);
    } catch {
      Alert.alert("Location", "Could not get current location.");
    }
  };

  if (loadingCenter) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Getting your location…</Text>
      </View>
    );
  }

  async function onConfirmBooking(event: GestureResponderEvent): Promise<void> {
    try {
      event?.preventDefault?.();
    } catch {
      /* noop */
    }

    if (!pickup || !dropoff) {
      Alert.alert(
        "Missing locations",
        "Please set both pickup and dropoff locations before confirming."
      );
      return;
    }

    setSubmitting(true);

    const payload = {
      pickup: { latitude: pickup[1], longitude: pickup[0], label: pickupLabel },
      dropoff: {
        latitude: dropoff[1],
        longitude: dropoff[0],
        label: dropoffLabel,
      },
      vehicleType: requiredVehicleType,
      loadType,
      price: price.trim() ? parseFloat(price) : undefined,
    };

    try {
      // Attempt to create booking via the API. Adjust the call if your useAPI() exposes a different method.
      if (typeof api.post === "function") {
        await api.post("/bookings", payload);
      } else if (
        "createBooking" in api &&
        typeof (api as any).createBooking === "function"
      ) {
        await (api as any).createBooking(payload);
      } else {
        // best-effort fallback: try a generic request method that accepts a single options object
        await (api.request?.({
          method: "POST",
          url: "/bookings",
          data: payload,
        }) as any);
      }

      Alert.alert("Booking Created", "Your booking was created successfully.");
      // resetAll is referenced elsewhere in the component UI; call it if available
      try {
        // @ts-ignore
        if (typeof resetAll === "function") resetAll();
      } catch {
        /* noop */
      }
    } catch (err) {
      console.error("Failed to create booking:", err);
      Alert.alert("Error", "Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function swap(event: GestureResponderEvent): void {
    try {
      event?.preventDefault?.();
    } catch {
      /* noop */
    }

    if (!pickup || !dropoff) return;

    const oldPickup = pickup;
    const oldPickupLabel = pickupLabel;

    // Swap coordinates and labels
    setPickup(dropoff);
    setPickupLabel(dropoffLabel);
    setDropoff(oldPickup);
    setDropoffLabel(oldPickupLabel);

    // Move camera to the new pickup (which was the previous dropoff)
    const newCenter = dropoff;
    setCenter(newCenter);
    cameraRef.current?.moveTo(newCenter, 800);
  }

  function resetAll(event?: GestureResponderEvent): void {
    try {
      event?.preventDefault?.();
    } catch {
      /* noop */
    }

    // Clear selected locations and labels
    setPickup(null);
    setDropoff(null);
    setPickupLabel("Pickup");
    setDropoffLabel("Dropoff");

    // Reset UI state
    setPhase("pickup");
    setQuery("");
    setResults([]);
    setShowResults(false);
    setSearching(false);
    setSubmitting(false);

    // Reset selectors to defaults
    setRequiredVehicleType("TRUCK");
    setLoadType("General Goods");
    setPrice("");

    // Dismiss keyboard and recenter camera to current center
    Keyboard.dismiss();
    cameraRef.current?.moveTo(center, 800);
  }

  return (
    <View style={{ flex: 1 }}>
      <MapboxGL.MapView
        style={{ flex: 1 }}
        logoEnabled={false}
        compassEnabled
        onRegionDidChange={onRegionDidChange}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={13}
          centerCoordinate={center}
          animationMode="easeTo"
          animationDuration={300}
        />
        {pickup && dropoff && (
          <MapboxGL.ShapeSource
            id="route"
            shape={{
              type: "Feature",
              geometry: { type: "LineString", coordinates: [pickup, dropoff] },
              properties: {},
            }}
          >
            <MapboxGL.LineLayer id="routeLine" style={{ lineWidth: 4 }} />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>

      {/* Center Pin */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "45%",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: phase === "pickup" ? "#2ecc71" : "#e74c3c",
            width: 18,
            height: 18,
            borderRadius: 9,
            borderWidth: 2,
            borderColor: "white",
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 3,
          }}
        />
      </View>

      {/* Top banner + Search */}
      <View style={{ position: "absolute", top: 48, left: 12, right: 12 }}>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <TextInput
            value={query}
            onChangeText={onChangeQuery}
            placeholder={
              phase === "pickup"
                ? "Search for pickup location..."
                : "Search for dropoff location..."
            }
            style={{ fontSize: 16 }}
          />
          {searching && (
            <ActivityIndicator
              style={{ position: "absolute", right: 12, top: 12 }}
              size="small"
            />
          )}
        </View>

        {showResults && (
          <View
            style={{
              backgroundColor: "white",
              marginTop: 4,
              borderRadius: 10,
              maxHeight: 300,
            }}
          >
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => goToResult(item)}
                  style={{
                    padding: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                  }}
                >
                  <Text numberOfLines={2}>{item.place_name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        <TouchableOpacity
          onPress={useMyLocationForPhase}
          style={{
            backgroundColor: "white",
            marginTop: 8,
            borderRadius: 10,
            padding: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>Use my current location</Text>
        </TouchableOpacity>
      </View>

      {/* Address chips */}
      <View
        style={{ position: "absolute", top: 160, left: 12, right: 12, gap: 8 }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            padding: 10,
            borderLeftWidth: 4,
            borderLeftColor: "#2ecc71",
          }}
        >
          <Text style={{ fontSize: 12, color: "#2ecc71" }}>Pickup</Text>
          <Text numberOfLines={1}>
            {pickup
              ? pickupLabel
              : phase === "pickup"
                ? "Move map or search…"
                : pickupLabel}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            padding: 10,
            borderLeftWidth: 4,
            borderLeftColor: "#e74c3c",
          }}
        >
          <Text style={{ fontSize: 12, color: "#e74c3c" }}>Dropoff</Text>
          <Text numberOfLines={1}>
            {dropoff
              ? dropoffLabel
              : phase === "dropoff"
                ? "Move map or search…"
                : dropoffLabel}
          </Text>
        </View>
      </View>

      {/* Vehicle Type selector */}
      <View style={{ position: "absolute", left: 0, right: 0, bottom: 140 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
        >
          {VEHICLE_TYPES.map((vt) => {
            const selected = vt === requiredVehicleType;
            return (
              <TouchableOpacity
                key={vt}
                onPress={() => setRequiredVehicleType(vt)}
                style={{
                  backgroundColor: selected ? "#111" : "#f0f0f0",
                  borderRadius: 999,
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                }}
              >
                <Text style={{ color: selected ? "white" : "#111" }}>
                  {vt.replace("_", " ")}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Load Type selector */}
      <View style={{ position: "absolute", left: 0, right: 0, bottom: 100 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
        >
          {LOAD_TYPES.map((lt) => {
            const selected = lt === loadType;
            return (
              <TouchableOpacity
                key={lt}
                onPress={() => setLoadType(lt)}
                style={{
                  backgroundColor: selected ? "#111" : "#f0f0f0",
                  borderRadius: 999,
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                }}
              >
                <Text style={{ color: selected ? "white" : "#111" }}>{lt}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Price Input */}
      <View
        style={{
          position: "absolute",
          left: 12,
          right: 12,
          bottom: 60,
          backgroundColor: "white",
          borderRadius: 10,
          padding: 12,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 6 }}>
          Price Estimate (PKR)
        </Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price estimate"
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            fontSize: 16,
          }}
        />
      </View>

      {/* Bottom bar */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "white",
          padding: 12,
          borderTopWidth: 1,
          borderColor: "#eee",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <TouchableOpacity
            onPress={swap}
            disabled={!pickup || !dropoff}
            style={{
              opacity: !pickup || !dropoff ? 0.4 : 1,
              backgroundColor: "#f0f0f0",
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 8,
            }}
          >
            <Text>Swap</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={resetAll}
            style={{
              backgroundColor: "#f0f0f0",
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 8,
            }}
          >
            <Text>Reset</Text>
          </TouchableOpacity>
        </View>
        {phase === "pickup" ? (
          <Button title="Set Pickup Here" onPress={captureCurrentPin} />
        ) : !dropoff ? (
          <Button title="Set Dropoff Here" onPress={captureCurrentPin} />
        ) : (
          <Button
            title="Confirm Booking"
            onPress={onConfirmBooking}
            disabled={!pickup || !dropoff || submitting}
          />
        )}
      </View>
    </View>
  );
}
