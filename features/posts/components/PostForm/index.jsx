"use client";

import { useSavePost } from "@/features/posts/hooks";
import { Button } from "@/shared/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./PostForm.module.css";

const EMPTY_FORM = {
  title: "",
  body: "",
  imageUrl: "",
};

export default function PostForm({ mode, post }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: post?.title || EMPTY_FORM.title,
    body: post?.body || EMPTY_FORM.body,
    imageUrl: post?.imageUrl || EMPTY_FORM.imageUrl,
  });
  const { error, isEditMode, isSubmitting, savePost } = useSavePost({
    mode,
    postId: post?.id,
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await savePost(formData);
  }

  function getSubmitLabel() {
    if (isSubmitting && isEditMode) {
      return "Saving edits...";
    }

    if (isSubmitting) {
      return "Publishing...";
    }

    if (isEditMode) {
      return "Save Changes";
    }

    return "Publish Post";
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

        <label className={styles.field}>
          <span>Image URL</span>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://images.example.com/story-cover.jpg"
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
            required
          />
        </label>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {getSubmitLabel()}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Go Back
        </Button>
      </div>
    </form>
  );
}
