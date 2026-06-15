"use client";

import { createPost, updatePost } from "@/features/posts/services/posts";
import { notifyError, notifySuccess } from "@/shared/lib/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./PostForm.module.css";

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
      const result = isEditMode
        ? await updatePost(post.id, formData)
        : await createPost(formData);

      if (!result.ok) {
        throw result.error;
      }

      const savedPost = result.data;

      notifySuccess(
        isEditMode ? "Post updated" : "Post published",
        result.message
      );

      router.push(isEditMode ? `/posts/${post.id}` : `/posts/${savedPost.id}`);
      router.refresh();
    } catch (requestError) {
      const message = requestError.message || "Unable to save the post.";

      setError(message);
      notifyError("Request failed", message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.grid}>
        <label className={styles.field}>
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

        <label className={`${styles.field} ${styles.fieldWide}`}>
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

      {error ? <p className={`feedback error-text ${styles.error}`}>{error}</p> : null}

      <div className={styles.actions}>
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