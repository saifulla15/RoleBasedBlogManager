import React, { useState, useEffect } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";

function AllPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    appwriteService.getPosts([]).then((posts) => {
      if (posts && posts.documents) {
        setPosts(posts.documents);
      } else {
        setPosts([]);
      }
    });
  }, []);

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.$id} className="p-2 w-1/4">
                <PostCard {...post} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 w-full">No posts found.</p>
          )}
        </div>
      </Container>
    </div>
  );
}

export default AllPosts;
