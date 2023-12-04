import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [userReviews, setUserReviews] = useState(null);
  const [userLinks, setUserLinks] = useState(null);
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
        setUserData(data.user[0]);

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
            setUserReviews(reviewsData.userReviews);
          else setUserReviews([]);
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

          setUserLinks(linkData.userLinks || []);
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
        <>
          {
            <div>
              <h2>{userData.username}'s Profile</h2>
              <div>
                <h3>Reviews:</h3>
                {userReviews && userReviews.length > 0 ? (
                  <ul>
                    {userReviews.map((review) => {
                      // return JSON.stringify(review);
                      return <li key={review.reviewid}>{review.content}</li>;
                      // if (review.id && review.content)
                      // else return <></>;
                    })}
                  </ul>
                ) : (
                  <p>No reviews available.</p>
                )}
              </div>
            </div>
          }
        </>
      ) : (
        <>
          <p> Loading ... </p>
        </>
      )}
    </>
  );

  //   <div>
  //     {loading ? (
  //       <p>Loading user profile...</p>
  //     ) : userData ? (
  //       <div>
  //         <h2>{userData[0].username}'s Profile</h2>
  //         <div>
  //           <h3>Reviews:</h3>
  //           {userReviews && userReviews.length > 0 ? (
  //             <ul>
  //               {userReviews.map((review) => (
  //                 <li key={review.id}>{review.content}</li>
  //               ))}
  //             </ul>
  //           ) : (
  //             <p>No reviews available.</p>
  //           )}
  //         </div>
  //         <div>
  //           <h3>Links:</h3>
  //           {/* {userLinks && userLinks.length > 0 ? (
  //             { userLinks }
  //           ) : (
  //             // <ul>
  //             //   {userLinks.map((link, index) => (
  //             //     <li key={index}>
  //             //       <a href={link} target="_blank" rel="noopener noreferrer">
  //             //         {link}
  //             //       </a>
  //             //     </li>
  //             //   ))}
  //             // </ul>
  //             <p>No links available.</p>
  //           )} */}
  //         </div>
  //       </div>
  //     ) : (
  //       <div>
  //         <p>User not found.</p>
  //       </div>
  //     )}
  //   </div>
  // );
};

export default UserProfile;
