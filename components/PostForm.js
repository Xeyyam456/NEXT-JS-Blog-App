"use client";

import { createPost, updatePost } from "@/services/posts";
import { useRouter } from "next/navigation";
import { useState } from "react";

const EMPTY_FORM = {
  title: "",
  body: "",
};

export default function PostForm({ mode, post }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: post?.title || EMPTY_FORM.title,
    body: post?.body || EMPTY_FORM.body,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = mode === "edit";

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const savedPost = isEditMode
        ? await updatePost(post.id, formData)
        : await createPost(formData);

      router.push(isEditMode ? `/posts/${post.id}` : `/posts/${savedPost.id}`);
      router.refresh();
    } catch (requestError) {
      setError(requestError.message || "Unable to save the post.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="form-field">
          <span>Headline</span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Write a striking title"
            minLength={3}
            required
          />
        </label>

        <label className="form-field form-field-wide">
          <span>Story body</span>
          <textarea
            name="body"
            value={formData.body}
            onChange={handleChange}
            placeholder="Shape the full article here"
            rows={10}
            minLength={10}
            required
          />
        </label>
      </div>

      {error ? <p className="feedback error-text">{error}</p> : null}

      <div className="form-actions">
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting
            ? isEditMode
              ? "Saving edits..."
              : "Publishing..."
            : isEditMode
              ? "Save Changes"
              : "Publish Post"}
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Go Back
        </button>
      </div>
    </form>
  );
}