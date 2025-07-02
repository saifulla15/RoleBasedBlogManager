import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import RichTextEditor from "../RichTextEditor";
export default function PostForm({ post }) {
  const [previewImage, setPreviewImage] = useState(null);
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.$id || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    try {
      if (post) {
        const file = data.image[0]
          ? await appwriteService.uploadFile(data.image[0])
          : null;

        if (file) {
          await appwriteService.deleteFile(post.featuredimage);
        }

        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredimage: file ? file.$id : post.featuredimage,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      } else {
        const imageFile = data.image?.[0];

        if (!imageFile) {
          alert("Please upload a featured image.");
          return;
        }

        const file = await appwriteService.uploadFile(imageFile);

        if (!file) {
          alert("Image upload failed. Please try again.");
          return;
          console.log("Uploaded image file:", file);
        }

        const fileId = file.$id;
        const dbPost = await appwriteService.createPost({
          title: data.title,
          slug: data.slug,
          content: data.content,
          status: data.status,
          featuredimage: fileId,
          userid: userData.$id,
        });

        // if (dbPost) {
        //   navigate(`/post/${dbPost.$id}`);
        // }
        if (dbPost && dbPost.$id) {
          navigate(`/post/${dbPost.$id}`);
        } else {
          console.error("Create post failed: ", dbPost);
          alert(
            "Post creation failed. Please check your inputs and try again."
          );
        }
      }
    } catch (error) {
      console.error("Post submission failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");

    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  // add
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "image" && value.image?.[0]) {
        const file = value.image[0];
        const url = URL.createObjectURL(file);
        setPreviewImage(url);

        // Cleanup the object URL when component unmounts or file changes
        return () => URL.revokeObjectURL(url);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RichTextEditor
          label="Content :"
          name="content"
          control={{ ...control, setValue }}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />
        <div className="w-full mb-4">
          {previewImage ? (
            <img src={previewImage} alt="Preview" className="rounded-lg" />
          ) : post?.featuredimage ? (
            <img
              src={appwriteService.getFilePreview(post.featuredimage)}
              alt={post.title}
              className="rounded-lg"
            />
          ) : null}
        </div>

        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />

        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
