import { useEffect, useState } from "react";
import { getApprovedExperts } from "../api-calls/expertVerificationApi";
import ExpertCard from "./ExpertCard";
import { jwtDecode } from "jwt-decode";
import { getUserProfile, getUserProfileByUsername } from "../api-calls/profileApi";

const Experts = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        console.log("PROFILE: ", profile);

        setCurrentUser({
          email: profile.email,
          username: profile.username,
          photo: profile.photo?.startsWith("http")
            ? profile.photo
            : `${import.meta.env.VITE_API_BASE_URL}${profile.photo}`,
        });
        
      } catch (err) {
        console.error("Не удалось загрузить профиль текущего пользователя", err);
      }
    };

    fetchProfile();
  }, []);

  const mapExpertData = (expert) => {
    const photoUrl = expert.user.photo
      ? expert.user.photo.startsWith("http")
        ? expert.user.photo
        : `${import.meta.env.VITE_API_BASE_URL}${expert.user.photo}`
      : null;
  
    return {
      name: `${expert.firstName} ${expert.lastName}`,
      username: expert.user.username,
      email: expert.user.email,
      photo: photoUrl,
      bio: expert.user.bio,
      status: "Открыт для консультаций",
      profession: expert.user.profession || "", // Ensure this is passed to ExpertCard
    };
  };
  

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const data = await getApprovedExperts();
        console.log("✅ Получены одобренные эксперты:", data);

        const mappedExperts = data.map(mapExpertData);
        console.log("✅ Преобразованные эксперты:", mappedExperts);

        setExperts(mappedExperts);
      } catch (err) {
        console.error(err);
        setError("Не удалось загрузить экспертов.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

  if (loading || !currentUser) return <div>Загрузка экспертов...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      {experts.length === 0 ? (
        <div className="text-center text-blue-700 text-sm italic">
          На данный момент ни один эксперт не был одобрен.
        </div>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map((expert, index) => (
            <ExpertCard key={index} expert={expert} currentUser={currentUser} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Experts;
