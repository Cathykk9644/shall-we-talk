import useAuthUser from "../hooks/useAuthUser";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../config/api";
import {
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
  CameraIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants";
import { useNavigate } from "react-router";

import imageCompression from "browser-image-compression";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "", // for preview
    image: "", // for sending to backend
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Hey you've completed the onboarding process successfully");
      queryClient.invalidateQueries({ queryKey: ["authenticatedUser"] });
      navigate("/practice-dashboard");
    },

    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({
      ...formState,
      profilePic: randomAvatar,
      image: randomAvatar,
    });
    toast.success("Random profile picture generated!");
  };

  const handleCustomAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10485760) {
      toast.error(
        "The selected file is over 10 MB. Please choose a smaller image."
      );
      return;
    }
    if (file) {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onload = () => {
          setFormState({
            ...formState,
            profilePic: reader.result, // for preview
            image: reader.result, // for backend upload
          });
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        toast.error("Failed to compress image");
      }
    }
  };

  const handleOnboarding = (e) => {
    e.preventDefault();
    // Only send the fields required by backend
    const payload = {
      fullName: formState.fullName,
      bio: formState.bio,
      nativeLanguage: formState.nativeLanguage,
      learningLanguage: formState.learningLanguage,
      location: formState.location,
      image: formState.image, // send image as base64 or url
    };
    onboardingMutation(payload);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-500 to-sky-100  flex items-center justify-center p-4">
      <div className="card  bg-opacity-80 w-full max-w-3xl shadow-xl border-2 border-gray-200">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-100">
            Complete Your Profile
          </h1>

          <form onSubmit={handleOnboarding} className="space-y-6">
            {/* PROFILE PIC CONTAINER */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* IMAGE PREVIEW */}
              <div className="size-32 rounded-full bg-base-200 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-30" />
                  </div>
                )}
              </div>
              {/* Upload Custom Avatar */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="customAvatar"
                  className="btn btn-outline outline-white hover:bg-sky-500 text-white hover:text-white transition-colors hover:scale-95 "
                >
                  <CameraIcon className="size-4 mr-2" />
                  Upload Custom Avatar
                </label>
                <input
                  id="customAvatar"
                  type="file"
                  accept="image/*"
                  onChange={handleCustomAvatarUpload}
                  className="hidden"
                />
              </div>

              {/* Generate Random Avatar BTN */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-outline outline-white hover:bg-sky-500 text-white hover:text-white transition-colors hover:scale-95 "
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-500">
                  Full Name
                </span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState({ ...formState, fullName: e.target.value })
                }
                className="input w-full text-sm  text-gray-500"
                placeholder="Pls enter your full name"
              />
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-500">
                  Bio
                </span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) =>
                  setFormState({ ...formState, bio: e.target.value })
                }
                className="textarea textarea-bordered h-24 text-ellipsis text-gray-500"
                placeholder="Tell others about yourself and what you are hoping to achieve on this language learning platform"
              />
            </div>

            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NATIVE LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-500">
                    Native Language
                  </span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      nativeLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full text-sm text-gray-500"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* LEARNING LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-500">
                    Learning Language
                  </span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      learningLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full text-sm text-gray-500"
                >
                  <option value="">Select language you'd like to learn</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-500">
                  Location
                </span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) =>
                    setFormState({ ...formState, location: e.target.value })
                  }
                  className="input input-bordered w-full pl-10 text-sm text-gray-500"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}

            <button
              className="btn bg-sky-500 w-full text-ellipsis text-white hover:bg-sky-600 transition-colors hover:scale-95"
              disabled={isPending}
              type="submit"
            >
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
