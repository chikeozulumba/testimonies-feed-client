"use client";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import classnames from "classnames";
import { DUMMY_TEXT } from "@/constants/dummy";
import { useAuth } from "@/providers/auth/context";

export const TextBox = () => {
  const user = useAuth();
  const uploadAttachmentsRef = useRef<HTMLInputElement | null>(null);
  const uploadImagesRef = useRef<HTMLInputElement | null>(null);

  const [processing, setProcessing] = useState<boolean>(false);
  const [title, setTitle] = useState<string|undefined>(undefined);
  const [comment, setComment] = useState<string>(DUMMY_TEXT);
  const [image, setImage] = useState<File | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);

  const isImageUploaded = image !== null;
  const isAttachmentUploaded = attachment !== null;

  const formChanges = (evt: ChangeEvent<HTMLInputElement>, mode: string) => {
    switch (mode) {
      case "attachments":
        return setAttachment(evt.target?.files?.[0] || null);
      case "images":
        return setImage(evt.target?.files?.[0] || null);
      default:
        return;
    }
  };

  const submitForm = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!user) return;
    setProcessing(true);
    // return;

    try {
      const formData = new FormData();
      formData.append("uid", user?.uid);
      user?.photoURL && formData.append("userPhoto", user?.photoURL);
      user?.displayName && formData.append("author", user?.displayName);
      comment && formData.append("comment", comment);
      title && formData.append("title", title);
      image && formData.append("image", image);
      attachment && formData.append("attachment", attachment);

      await fetch("/api/testimonies", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        body: formData,
      });
      setProcessing(false);
    } catch (error) {
      setProcessing(false);
    }
  };

  return (
    <>
      <form onSubmit={submitForm}>
        <div className="w-full mb-4 border border-gray-200 rounded-3xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 overflow-hidden">
          <div className="bg-white px-4 py-2 rounded-t-lg">
            <div>
              <label htmlFor="title" className="sr-only">
                Titile
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className="px-0 border-none w-full text-lg placeholder-shown:opacity-75 font-semibold resize-none text-gray-900 bg-white focus:ring-0 dark:text-white dark:placeholder-gray-400"
                placeholder="Give your testimony a title..."
                defaultValue={title}
                onChange={(evt) => setTitle(evt.target.value)}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="comment" className="sr-only">
                Your comment
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={4}
                className="px-0 w-full text-sm resize-none text-gray-900 bg-white border-0 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                placeholder="Write a comment..."
                defaultValue={comment}
                onChange={(evt) => setComment(evt.target.value)}
                required
              ></textarea>
            </div>
          </div>
          <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
            <button
              type="submit"
              className="inline-flex gap-2 items-center py-2.5 px-4 text-xs font-normal text-center text-white bg-blue-700 rounded-3xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
            >
              {processing ? (
                <svg
                  className="animate-spin -ml-1 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="-ml-1 w-4 h-4 -rotate-90"
                >
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              )}
              {processing ? "Saving" : "Share your testimony"}
            </button>
            <div className="flex pl-0 space-x-1 sm:pl-2">
              <Tooltip clickable id="attach-documents-button" />
              <button
                onClick={() => uploadAttachmentsRef.current?.click()}
                data-tooltip-id="attach-documents-button"
                data-tooltip-content="Attach documents"
                type="button"
                className={classnames(
                  "inline-flex justify-center items-center p-2 rounded cursor-pointer hover:bg-gray-100",
                  isAttachmentUploaded
                    ? "text-blue-500 hover:text-blue-900"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 12 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 6v8a5 5 0 1 0 10 0V4.5a3.5 3.5 0 1 0-7 0V13a2 2 0 0 0 4 0V6"
                  />
                </svg>
                <span className="sr-only">Attach file</span>
              </button>
              <Tooltip clickable id="upload-photo-button" />
              <button
                onClick={() => uploadImagesRef.current?.click()}
                data-tooltip-id="upload-photo-button"
                data-tooltip-content="Upload photo"
                type="button"
                className={classnames(
                  "inline-flex justify-center items-center p-2 rounded cursor-pointer hover:bg-gray-100",
                  isImageUploaded
                    ? "text-blue-500 hover:text-blue-900"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                </svg>
                <span className="sr-only">Upload image</span>
              </button>
            </div>
          </div>
        </div>

        <input
          type="file"
          ref={uploadAttachmentsRef}
          name="attachment"
          accept="application/msword,application/vnd.ms-powerpoint,application/pdf"
          className="hidden"
          onChange={(evt) => formChanges(evt, "attachments")}
        />
        <input
          type="file"
          ref={uploadImagesRef}
          name="image"
          accept="image/png, image/gif, image/jpeg"
          className="hidden"
          onChange={(evt) => formChanges(evt, "images")}
        />
      </form>
      <p className="ml-auto text-xs text-gray-500 dark:text-gray-400">
        Remember, contributions should follow our{" "}
        <a
          href="#"
          className="text-blue-600 dark:text-blue-500 hover:underline"
        >
          Community Guidelines
        </a>
        .
      </p>
    </>
  );
};
