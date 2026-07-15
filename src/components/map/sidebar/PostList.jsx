import React from "react";
import PostCard from "./PostCard";

export default function PostList({ posts, selectedPostId, onPostClick }) {
    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                <svg
                    className="w-16 h-16 mb-4 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                <p className="text-sm">No posts found</p>
                <p className="text-xs mt-1">Try adjusting your filters</p>
            </div>
        );
    }

    return (
        <div
            className="p-4 space-y-4"
            style={{
                height: "100%",
                overflowY: "auto",
                overflowX: "hidden"
            }}
        >
            {posts.map((post) => (
                <PostCard
                    key={post.report_id}
                    post={post}
                    isSelected={selectedPostId === post.report_id}
                    onClick={onPostClick}
                />
            ))}
        </div>
    );
}