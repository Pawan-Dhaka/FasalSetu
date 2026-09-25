"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Crosshair, MapPin, Save } from "lucide-react";
import Link from "next/link";

type Profile = {
  name: string;
  email: string | null;
  mobile: string;
  address: string | null;
  village: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
};

export default function FarmerProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await fetch("/api/farmer/profile");

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load profile");
      }

      setProfile({
        ...data.farmer,
        latitude:
          data.farmer.latitude !== null
            ? Number(data.farmer.latitude)
            : null,
        longitude:
          data.farmer.longitude !== null
            ? Number(data.farmer.longitude)
            : null,
      });
    } catch (error) {
      console.error(error);
      setMessage("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  function updateField(field: keyof Profile, value: string) {
    if (!profile) return;

    setProfile({
      ...profile,
      [field]: value,
    });
  }

  function getCurrentLocation() {
    if (!navigator.geolocation) {
      setMessage("Location is not supported by your browser.");
      return;
    }

    setLocationLoading(true);
    setMessage("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              }
            : prev
        );

        setLocationLoading(false);
        setMessage("Location detected successfully.");
      },
      (error) => {
        console.error(error);

        setLocationLoading(false);

        if (error.code === error.PERMISSION_DENIED) {
          setMessage(
            "Location permission denied. Please allow location access."
          );
        } else {
          setMessage("Could not detect your location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  async function saveProfile() {
    if (!profile) return;

    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/farmer/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: profile.address,
          village: profile.village,
          city: profile.city,
          state: profile.state,
          pincode: profile.pincode,
          latitude: profile.latitude,
          longitude: profile.longitude,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save profile");
      }

      setMessage("Profile saved successfully.");
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F6F8F3] p-6">
        <div className="mx-auto max-w-4xl rounded-[26px] bg-white p-8 shadow-sm">
          Loading profile...
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#F6F8F3] p-6">
        <div className="mx-auto max-w-4xl rounded-[26px] bg-white p-8 shadow-sm">
          {message || "Profile not found"}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F8F3] text-[#17221B]">
      <div className="mx-auto max-w-4xl px-5 py-7 sm:px-8">
        <Link
          href="/farmer"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#1F7A4D]"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-black">
            Farm Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Keep your farm and location details updated.
          </p>
        </div>

        <section className="rounded-[26px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7">
            <h2 className="text-lg font-black">
              Personal details
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              These details come from your account.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <InputField
              label="Name"
              value={profile.name}
              disabled
            />

            <InputField
              label="Mobile"
              value={profile.mobile}
              disabled
            />

            <InputField
              label="Email"
              value={profile.email || ""}
              disabled
            />
          </div>

          <div className="my-8 border-t border-gray-100" />

          <div className="mb-7">
            <h2 className="text-lg font-black">
              Farm location
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              This location can help consumers understand where
              your produce comes from.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold text-gray-700">
                Farm Address
              </label>

              <textarea
                value={profile.address || ""}
                onChange={(e) =>
                  updateField("address", e.target.value)
                }
                rows={3}
                placeholder="Enter your farm address"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#1F7A4D] focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                label="Village / Area"
                value={profile.village || ""}
                placeholder="e.g. Sanganer"
                onChange={(value) =>
                  updateField("village", value)
                }
              />

              <InputField
                label="City"
                value={profile.city || ""}
                placeholder="e.g. Jaipur"
                onChange={(value) =>
                  updateField("city", value)
                }
              />

              <InputField
                label="State"
                value={profile.state || ""}
                placeholder="e.g. Rajasthan"
                onChange={(value) =>
                  updateField("state", value)
                }
              />

              <InputField
                label="Pincode"
                value={profile.pincode || ""}
                placeholder="e.g. 302029"
                onChange={(value) =>
                  updateField("pincode", value)
                }
              />
            </div>

            <div className="rounded-2xl border border-green-100 bg-[#F4F8F2] p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DCEEDF] text-[#1F7A4D]">
                    <MapPin size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-black">
                      GPS Location
                    </p>

                    {profile.latitude !== null &&
                    profile.longitude !== null ? (
                      <p className="mt-1 text-[10px] text-gray-500">
                        {profile.latitude.toFixed(6)},{" "}
                        {profile.longitude.toFixed(6)}
                      </p>
                    ) : (
                      <p className="mt-1 text-[10px] text-gray-500">
                        Location not added yet
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#1F7A4D] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#17633E] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Crosshair size={15} />

                  {locationLoading
                    ? "Detecting..."
                    : "Use Current Location"}
                </button>
              </div>
            </div>

            {message && (
              <div className="rounded-xl bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-600">
                {message}
              </div>
            )}

            <button
              type="button"
              onClick={saveProfile}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F7A4D] py-3.5 text-sm font-bold text-white transition hover:bg-[#17633E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />

              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function InputField({
  label,
  value,
  placeholder,
  disabled = false,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-gray-700">
        {label}
      </label>

      <input
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#1F7A4D] focus:ring-2 focus:ring-green-100 disabled:bg-gray-50 disabled:text-gray-500"
      />
    </div>
  );
}