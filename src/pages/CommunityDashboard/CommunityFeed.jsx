import React, { useState, useEffect, useContext } from "react"; // Changed 'use' to 'useContext' for standard React
import toast from "react-hot-toast";
import { AuthContext } from "../../provider/AuthProvider";
import { Link } from "react-router";
import { Helmet } from "react-helmet";

const CommunityFeed = () => {
  // 1. Standard way to access context
  const { user, loading: authLoading } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPosts = () => {
    fetch("https://civiceye-server.vercel.app/api/community/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching posts:", err));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    // 2. Prevent submission if user isn't loaded yet
    if (!user?.email) {
      return toast.error("Wait a moment, identifying user...");
    }

    if (!content.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        "https://civiceye-server.vercel.app/api/community/posts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content,
            userName: user?.displayName || "Anonymous", // Fallback if name is missing
            userEmail: user?.email,
          }),
        },
      );

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        toast.success(data.message);
        setContent("");
        fetchPosts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error, "Network error. Try again.");
    }
  };

  const handleLike = async (postId) => {
    if (!user?.email) return toast.error("Log in to like posts!");

    const response = await fetch(
      `https://civiceye-server.vercel.app/api/community/posts/like/${postId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: user.email }),
      },
    );

    const data = await response.json();
    if (data.success) {
      fetchPosts();
    }
  };

  // 3. SHOW LOADING UNTIL AUTH IS READY
  // This prevents the UI from showing 'null' or breaking on refresh
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="loading loading-infinity loading-lg text-teal-600"></span>
        <h2 className="font-black uppercase italic animate-pulse">
          Checking ID...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <Helmet>
        <title>Feed || CivicEye</title>
      </Helmet>
      <div className="max-w-2xl my-10 mx-auto">
        <h1 className="italic font-bold text-5xl my-2">
          Community <span className="text-teal-600">Feed</span>
        </h1>
        <p className="italic text-gray-500 pl-2 mb-3">
          Post anything about your community
        </p>
        {/* CREATE POST AREA - Only show if user is logged in */}
        {user ? (
          <div className="bg-white p-6 rounded-[35px] shadow-xl mb-10 border border-slate-100">
            <form onSubmit={handlePostSubmit}>
              <textarea
                className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 ring-primary/20 font-bold text-teal-900 placeholder:opacity-50"
                required
                placeholder={`What's on your mind, ${user?.displayName?.split(" ")[0]}?`}
                rows="3"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-[10px] font-black uppercase opacity-50 italic">
                  AI Moderation Active
                </span>
                <button
                  disabled={loading}
                  className={`btn bg-teal-600 text-white rounded-2xl px-8 font-black uppercase italic ${loading && "loading"}`}
                >
                  {loading ? "Checking" : "Post"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <Link to="/auth/login">
            <div className="bg-amber-50 p-6 rounded-[35px] shadow-sm mb-10 text-center border border-amber-100 hover:bg-amber-200">
              <p className="text-amber-600 font-black uppercase italic text-xs">
                Login to post in the community feed
              </p>
            </div>
          </Link>
        )}

        {/* FEED */}
        <div className="space-y-6">
          {posts.map((post) => {
            // Check if current user has liked this specific post
            const hasLiked = post.likes?.includes(user?.email);

            return (
              <div
                key={post._id}
                className="bg-white p-8 rounded-[40px] shadow-lg border border-slate-50"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="avatar placeholder">
                    <div className="bg-slate-900 text-white rounded-2xl w-12 flex items-center justify-center">
                      <span className="text-xl font-bold">
                        {post.userName?.[0] || "?"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-black uppercase text-slate-800 leading-none">
                      {post.userName}
                    </h4>
                    <p className="text-[10px] font-bold opacity-30 mt-1">
                      {new Date(post.createdAt).toLocaleDateString()} at{" "}
                      {new Date(post.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <p className="text-slate-600 font-bold mb-6">{post.content}</p>

                {/* LIKE BUTTON */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center gap-2 transition-all active:scale-125 ${hasLiked ? "text-red-500" : "text-slate-400"}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 ${hasLiked ? "fill-current" : "fill-none"}`}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span className="text-xs font-black uppercase italic">
                      {post.likes?.length || 0} Likes
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommunityFeed;
