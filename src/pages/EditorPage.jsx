import React from "react";
import RichTextEditor from "../components/RichTextEditor";

function EditorPage() {
  return (
    <div className="container mx-auto py-4">
      <h1 className="text-xl font-semibold mb-4">Write Your Blog Post</h1>
      <RichTextEditor />
    </div>
  );
}

export default EditorPage;
