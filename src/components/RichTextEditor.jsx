import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";

export default function RichTextEditor({
  name = "content",
  control,
  label,
  defaultValue = "",
}) {
  return (
    <div className="w-full">
      {label && <label className="inline-block mb-1 pl-1">{label}</label>}

      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange } }) => (
          <Editor
            apiKey="sbb0fvg7y6az1eh0mqafhu8pis9dgvhy48nu8bhac6f87kls"
            initialValue={defaultValue}
            init={{
              height: 500,
              menubar: true,
              // plugins: [
              //   "advlist autolink lists link image charmap preview anchor",
              //   "searchreplace visualblocks code fullscreen",
              //   "insertdatetime media table paste help wordcount",
              // ],
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "paste",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | bold italic forecolor | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | link image media | " +
                "removeformat | preview | code | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
            onEditorChange={onChange}
          />
        )}
      />
    </div>
  );
}
