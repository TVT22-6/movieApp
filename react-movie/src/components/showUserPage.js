import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileCard from "./profileCard";

const UserProfile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [userLinks, setUserLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);

  // ... (existing code)

  useEffect(() => {
    if (!fetching) fetchUserData();
  }, [username]);

  const fetchUserData = async () => {
    try {
      console.log("Fetching user data...");
      setFetching(true);

      const response = await fetch(
        `http://localhost:3001/user/getUser/${username}`
      );

      if (!response.ok) {
        throw new Error(`HTTP Error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("User data:", data);

      if (data.user) {
        console.log("Setting user data:", data.user);
        setUserData(data.user);
        console.log("userData565:", data.user);

        try {
          console.log("Fetching user reviews...");

          const reviewsResponse = await fetch(
            `http://localhost:3001/user/getUserReview/${username}`
          );

          if (!reviewsResponse.ok) {
            throw new Error(`HTTP Error! status: ${reviewsResponse.status}`);
          }

          const reviewsData = await reviewsResponse.json();
          console.log("Reviews data:", reviewsData);
          if (reviewsData && reviewsData.userReviews.length > 0)
            console.log("userReviews if:", reviewsData.userReviews);
          console.log("reviesData if:", reviewsData);
          console.log(
            "reviewsData.userReviews if:",
            reviewsData.userReviews.length
          );
          setUserReviews(reviewsData.userReviews);
          console.log("userReviews else112:", reviewsData.userReviews);
          //else setUserReviews([]);
          console.log("userReviews else:", userReviews);
        } catch (reviewsError) {
          console.error("Error fetching user reviews:", reviewsError);
          setUserReviews([]); // Set an empty array in case of an error
          setFetching(false);
        }

        try {
          console.log("Fetching user links...");

          const linkResponse = await fetch(
            `http://localhost:3001/user/getUserLinks/${username}`
          );

          if (!linkResponse.ok) {
            throw new Error(`HTTP Error! status: ${linkResponse.status}`);
          }

          const linkData = await linkResponse.json();
          console.log("Links data:", linkData);
          if (linkData && linkData.userLinks.length > 0)
            console.log("userLinks if:", linkData.userLinks);
          console.log("linkData if:", linkData);
          console.log("linkData.userLinks if:", linkData.userLinks.length);
          setUserLinks(linkData.userLinks);
        } catch (linkError) {
          console.error("Error fetching user links:", linkError);
          setUserLinks([]); // Set an empty array in case of an error
          setFetching(false);
        } finally {
          setLoading(false); // Set loading to false after both fetches
          setFetching(false);
        }
      } else {
        console.warn("User not found");
        setLoading(false); // Set loading to false if user not found
        setFetching(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false); // Set loading to false in case of an error
      setFetching(false);
    }
  };

  // ... (existing code)

  return (
    <>
      {userData && userData.username ? (
        (console.log("userData1234:", userData),
        (
          <>
            {
              <div>
                <h2>{userData.username}'s Profile</h2>
                <div>
                  <h3>Reviews:</h3>
                  {userReviews && userReviews.length > 0 ? (
                    <table>
                      <tbody>
                        {userReviews.map((review, index) => (
                          <React.Fragment key={index}>
                            <ProfileCard key={review.reviewid} review={review}>
                              <td>{review.moviename}</td>
                              <td>{review.uservotescore}</td>
                              <td>{review.content}</td>
                              <td>
                                {new Date(
                                  review.dateposted
                                ).toLocaleDateString()}
                              </td>
                              <span>{review.genre}</span>
                            </ProfileCard>
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No reviews available.</p>
                  )}
                </div>
                <div>
                  <h3>Links:</h3>
                  {userLinks && userLinks.length > 0 ? (
                    <ul>
                      {userLinks.map((link) => {
                        return (
                          <li key={link.linkname}>
                            {link.personallink}
                            {link.linkname}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p>No links available.</p>
                  )}
                </div>
              </div>
            }
          </>
        ))
      ) : (
        <>
          <p> Loading ... </p>
        </>
      )}
    </>
  );
};

export default UserProfile;
