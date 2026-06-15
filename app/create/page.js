import PostForm from "@/components/PostForm";

export const metadata = {
  title: "Create Post | Pulse Press",
};

export default function CreatePage() {
  return (
    <main className="page-shell">
      <section className="form-layout panel-surface">
        <div className="form-intro">
          <p className="section-kicker">Create story</p>
          <h1>Publish a bold new article.</h1>
          <p>
            This route stays server-rendered, while the form itself is isolated
            as a client component for hook-based interaction.
          </p>
        </div>

        <div className="post-form-shell">
          <div className="section-headline compact-headline">
          <div>
            <p className="section-kicker">Endpoint</p>
            <h2>POST /posts</h2>
          </div>
          <p className="section-summary">Send title and body to the live API.</p>
        </div>
        <PostForm mode="create" />
        </div>
      </section>
    </main>
  );
}