import React, { useState } from "react";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} from "../config/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { LANGUAGES } from "../constants";

const editableFields = [
  { key: "fullName", label: "Name", type: "text" },
  { key: "bio", label: "Bio", type: "textarea" },
  { key: "nativeLanguage", label: "Native Language", type: "select" },
  { key: "learningLanguage", label: "Learning Language", type: "select" },
];

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const [editField, setEditField] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    bio: "",
    nativeLanguage: "",
    learningLanguage: "",
    profilePic: "",
  });
  const [message, setMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  // Handle profile image change
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMessage("");
    setUploadingImage(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Image = reader.result;
        // Call update mutation for profilePic
        updateMutation.mutate(
          { profilePic: base64Image },
          {
            onSuccess: () => setMessage("Profile image updated!"),
            onError: () => setMessage("Failed to update image."),
            onSettled: () => setUploadingImage(false),
          }
        );
      };
    } catch (err) {
      setMessage("Failed to update image.");
      setUploadingImage(false);
    }
  };

  // Fetch user profile
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    onSuccess: (data) => {
      setForm({
        fullName: data.fullName || "",
        bio: data.bio || "",
        nativeLanguage: data.nativeLanguage || "",
        learningLanguage: data.learningLanguage || "",
        profilePic: data.profilePic || "",
      });
    },
  });

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["userProfile"], data);
      setEditField(null);
      setMessage("Profile updated successfully!");
    },
    onError: () => setMessage("Update failed."),
  });

  // Delete account mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUserAccount,
    onSuccess: () => {
      setMessage("Account deleted. Logging out...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    },
    onError: () => setMessage("Failed to delete account."),
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdateField = (e) => {
    e.preventDefault();
    setMessage("");
    updateMutation.mutate({ [editField]: form[editField] });
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    deleteMutation.mutate();
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg text-sky-500" />
      </div>
    );
  if (isError)
    return (
      <div className="flex justify-center py-12 text-rose-500">
        {error?.message || "Failed to load profile."}
      </div>
    );
  if (!user)
    return (
      <div className="flex justify-center py-12 text-gray-500">
        No user found.
      </div>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-bgColor1 min-h-screen">
      <div className="container mx-auto max-w-4xl flex flex-col items-center justify-center text-gray-500">
        <div className="card bg-slate-200 p-12 rounded-2xl shadow-md w-full">
          <div className="flex items-center gap-8 mb-8">
            <div className="relative avatar size-32 border-2 border-gray-300 rounded-full overflow-hidden group">
              <img
                src={user.profilePic}
                alt="Profile"
                className="object-cover w-full h-full"
              />
              {/* Edit button in lower right corner of avatar */}
              <label
                htmlFor="profile-pic-upload"
                className="absolute bottom-1 right-4 border bg-sky-500 bg-opacity-90 rounded-full px-2 py-1 flex items-center justify-center cursor-pointer shadow-lg  border-white transition-all duration-200 hover:bg-sky-600"
                style={{ zIndex: 3 }}
                title="Change profile image"
              >
                <span className="text-white font-semibold text-xs">Edit</span>
                <input
                  id="profile-pic-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                  disabled={uploadingImage}
                />
              </label>
              {uploadingImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-sky-600 bg-opacity-40 z-10">
                  <span className="loading loading-spinner loading-md text-white" />
                </div>
              )}
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-500 text-left mb-0 ml-4">
              My Profile
            </h2>
          </div>
          {message && (
            <div
              className={`mb-4 px-4 py-2 rounded text-center font-semibold ${
                message.includes("updated")
                  ? "bg-slate-300 text-sky-600 "
                  : "bg-red-100 text-rose-400"
              }`}
            >
              {message}
            </div>
          )}
          <div className="space-y-8">
            {editableFields.map((field) => (
              <div key={field.key} className="flex items-start gap-2">
                <span className="font-semibold text-gray-600 min-w-[180px] block">
                  {field.label}:
                </span>
                {editField === field.key ? (
                  <form
                    onSubmit={handleUpdateField}
                    className="flex-1 flex gap-2 items-center"
                  >
                    {field.type === "textarea" ? (
                      <textarea
                        name={field.key}
                        value={form[field.key]}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full bg-white min-h-[30px]"
                        autoFocus
                      />
                    ) : field.type === "select" ? (
                      <select
                        name={field.key}
                        value={form[field.key]}
                        onChange={handleChange}
                        className="select select-bordered w-full bg-white"
                        autoFocus
                      >
                        <option value="">
                          {field.key === "nativeLanguage"
                            ? "Select your native language"
                            : "Select language you'd like to learn"}
                        </option>
                        {LANGUAGES.map((lang) => (
                          <option key={lang} value={lang.toLowerCase()}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        name={field.key}
                        value={form[field.key]}
                        onChange={handleChange}
                        className="input input-bordered w-full bg-white"
                        autoFocus
                      />
                    )}
                    <button
                      type="submit"
                      className="btn bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-1"
                      disabled={updateMutation.isLoading}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditField(null);
                        setForm((prev) => ({
                          ...prev,
                          [field.key]: user[field.key] || "",
                        }));
                      }}
                      className="btn bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-4 py-1"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-gray-500">
                      {user[field.key] || (
                        <span className="text-gray-400">
                          {field.key === "bio" ? "No bio" : "N/A"}
                        </span>
                      )}
                    </span>
                    <button
                      onClick={() => setEditField(field.key)}
                      className="ml-2 text-sky-500 hover:text-sky-700 p-1"
                      aria-label={`Edit ${field.label}`}
                    >
                      <Pencil size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div className="flex gap-3 mt-10 justify-start">
              <button
                onClick={handleDelete}
                className="btn bg-sky-500 hover:bg-rose-400 text-white font-semibold px-8 py-2"
              >
                Delete Account
              </button>
            </div>
            {/* Modal for delete confirmation */}
            {showDeleteModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-sky-800 bg-opacity-40 z-50">
                <div className="bg-slate-200 rounded-2xl shadow-md p-10 max-w-sm w-full  border-sky-600 border-2 flex flex-col items-center">
                  <h3 className="text-2xl font-bold mb-4 text-gray-600">
                    Confirm Account Deletion
                  </h3>

                  <p className="mb-6 text-gray-500 text-center text-sm font-semibold">
                    Are you sure you want to delete your account? This action
                    cannot be undone.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={cancelDelete}
                      className="btn bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-1 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="btn bg-rose-400 hover:bg-rose-500 text-white font-semibold px-4 py-1 rounded-xl"
                      disabled={deleteMutation.isLoading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
