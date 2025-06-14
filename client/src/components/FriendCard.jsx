import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-slate-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-4 mb-3">
          <div className="avatar size-12 border-2 border-gray-300 rounded-full ">
            <img src={friend.profilePic} alt={friend.fullName} />
          </div>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge bg-sky-500 text-white font-semibold text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            Native:{" "}
            {friend.nativeLanguage.charAt(0).toUpperCase() +
              friend.nativeLanguage.slice(1)}
          </span>
          <span className="badge border-gray-500 text-gray-500 bg-gray-200 font-semibold text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            Learning:{" "}
            {friend.learningLanguage.charAt(0).toUpperCase() +
              friend.learningLanguage.slice(1)}
          </span>
        </div>

        <Link
          to={`/chat/${friend._id}`}
          className="btn w-full btn-md bg-sky-500 hover:bg-sky-600 text-white "
        >
          Message
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
