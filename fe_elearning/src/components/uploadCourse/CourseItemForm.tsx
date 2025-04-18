"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputRegisterLecture from "@/components/inputComponent/inputRegisterLecture";
import TextAreaRegisterLecture from "@/components/inputComponent/textAreaRegisterLecture";
import { Button } from "@/components/ui/button";
import { APIInitCourseItem } from "@/utils/course";
import { uploadToMinIO, getVideoDuration } from "@/utils/storage";
import AlertSuccess from "@/components/alert/AlertSuccess";
import AlertError from "@/components/alert/AlertError";
import {
  CourseItem,
  Section,
  VideoType,
  ResourceType,
} from "@/types/courseType";
import VideoPlayer from "@/components/courseDetails/videoPlayer";
import { Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

// ===== VALIDATION SCHEMA =====
const courseItemSchema = yup.object().shape({
  title: yup.string().required("Tiêu đề bài học không được để trống"),
  description: yup.string().required("Nội dung bài học không được để trống"),
  video: yup
    .object()
    .shape({
      id: yup.string().required("ID của video không được để trống"),
      video_duration: yup.number().nullable(),
      video: yup.object().shape({
        key: yup.string().required(),
        status: yup.string().oneOf(["uploaded", "validated", "pending"]),
        bucket: yup.string(),
        rejection_reason: yup.string().nullable(),
      }),
      version: yup.number(),
    })
    .nullable(),
  resources: yup.array().of(
    yup.object().shape({
      resource_file: yup.object().shape({
        id: yup.string().required(),
      }),
      name: yup.string().required(),
    })
  ),
  is_preview: yup.boolean().default(false),
  position: yup.string(),
  section_id: yup.string(),
  id: yup.string(),
  status: yup.string().optional(),
  previous_position: yup.string().optional(),
  video_duration: yup.number().nullable().default(null),
});

interface CourseItemFormProps {
  sectionIndex: number;
  section: Section;
  onSave: () => void;
  onCancel: () => void;
  initialValues?: CourseItem | null;
}

const CourseItemForm: React.FC<CourseItemFormProps> = ({
  sectionIndex,
  section,
  onSave,
  onCancel,
  initialValues,
}) => {
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);
  const [description, setDescription] = useState("");
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [documentPreviews, setDocumentPreviews] = useState<
    Array<{ name: string; url: string }>
  >([]);
  const [createdItem, setCreatedItem] = useState<CourseItem | null>(null);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [documentUploadProgress, setDocumentUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [uploadingDocuments, setUploadingDocuments] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CourseItem>({
    resolver: yupResolver(courseItemSchema) as unknown as Resolver<CourseItem>,
    defaultValues: {
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      video: initialValues?.video || null,
      resources: initialValues?.resources || undefined,
      is_preview: initialValues?.is_preview || false,
      video_duration: initialValues?.video_duration || null,
      position: initialValues?.position || "",
      section_id: section.id,
      id: initialValues?.id || "",
      status: initialValues?.status || "ACTIVE",
      previous_position: initialValues?.previous_position || undefined,
    },
  });

  useEffect(() => {
    if (initialValues?.video?.video?.key) {
      setVideoPreview(
        process.env.NEXT_PUBLIC_BASE_URL_VIDEO + initialValues.video.video.key
      );
    }
  }, [initialValues]);

  const handleAddCourseItem = async (data: CourseItem) => {
    try {
      const payload = {
        title: data.title,
        is_preview: data.is_preview,
        section: { id: section.id },
        video: data.video ? { id: data.video.id } : null,
        video_duration: data.video_duration || null,
        description: data.description,
        resources: data.resources || undefined,
        previous_position: section.items?.length
          ? section.items[section.items.length - 1].position
          : null,
      };

      const response = await APIInitCourseItem(payload);
      if (response?.status === 201) {
        setShowAlertSuccess(true);
        setDescription("Bài giảng đã được thêm thành công!");
        setTimeout(() => setShowAlertSuccess(false), 3000);
        setCreatedItem(response.data);
        onSave();
      }
    } catch (error) {
      console.error("Error adding course item:", error);
      setShowAlertError(true);
      setDescription("Không thể thêm bài giảng");
      setTimeout(() => setShowAlertError(false), 3000);
    }
  };

  const handleVideoUpload = async (file: File) => {
    try {
      setIsVideoUploading(true);
      setVideoUploadProgress(0);

      const progressInterval = setInterval(() => {
        setVideoUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const { id, key } = await uploadToMinIO(file, "lecture-video", "video");
      const duration = await getVideoDuration(file);

      clearInterval(progressInterval);
      setVideoUploadProgress(100);

      const video: VideoType = {
        id,
        video_duration: Math.round(duration),
        video: {
          key,
          status: "uploaded",
          bucket: "video",
          rejection_reason: null,
        },
        version: 1,
      };

      setValue("video", video);
      setValue("video_duration", Math.round(duration));
      setVideoPreview(process.env.NEXT_PUBLIC_BASE_URL_VIDEO + key);

      setTimeout(() => {
        setIsVideoUploading(false);
        setVideoUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.error("Error uploading video:", error);
      setIsVideoUploading(false);
      setVideoUploadProgress(0);
      setShowAlertError(true);
      setDescription("Lỗi khi tải lên video");
      setTimeout(() => setShowAlertError(false), 3000);
    }
  };

  const handleDocumentUpload = async (files: File[], field: any) => {
    const uploadedResources: ResourceType[] = [];
    const newPreviews = [];
    const fileNames = files.map((f) => f.name);
    setUploadingDocuments(fileNames);

    for (const file of files) {
      try {
        setDocumentUploadProgress((prev) => ({
          ...prev,
          [file.name]: 0,
        }));

        const progressInterval = setInterval(() => {
          setDocumentUploadProgress((prev) => ({
            ...prev,
            [file.name]: prev[file.name] >= 90 ? 90 : prev[file.name] + 10,
          }));
        }, 300);

        const { id } = await uploadToMinIO(file, "resource", "resource_file");

        clearInterval(progressInterval);
        setDocumentUploadProgress((prev) => ({
          ...prev,
          [file.name]: 100,
        }));

        uploadedResources.push({
          resource_file: { id },
          name: file.name,
        });
        newPreviews.push({
          name: file.name,
          url: URL.createObjectURL(file),
        });
      } catch (error) {
        console.error(`Error uploading document ${file.name}:`, error);
        setShowAlertError(true);
        setDescription(`Lỗi khi tải lên tài liệu ${file.name}`);
        setTimeout(() => setShowAlertError(false), 3000);
      }
    }

    const currentResources = field.value || [];
    field.onChange([...currentResources, ...uploadedResources]);
    setDocumentPreviews([...documentPreviews, ...newPreviews]);

    setTimeout(() => {
      setUploadingDocuments([]);
      setDocumentUploadProgress({});
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {createdItem && (
        <div className="bg-AntiFlashWhite dark:bg-gray/80 p-4 rounded-xl border border-gray/20 dark:border-gray/70 shadow-sm">
          <h4 className="font-semibold text-lg mb-3">📝 Bài giảng vừa tạo:</h4>
          <div className="space-y-3 text-sm">
            <p>
              <strong className="text-eerieBlack dark:text-white/80">
                Tiêu đề:
              </strong>{" "}
              {createdItem.title}
            </p>
            <p>
              <strong className="text-eerieBlack dark:text-white/80">
                Nội dung:
              </strong>{" "}
              <span
                className="ql-content"
                dangerouslySetInnerHTML={{
                  __html: createdItem.description,
                }}
              />
            </p>
            {createdItem.video?.video?.key && (
              <div>
                <p className="font-semibold">🎥 Video:</p>
                <VideoPlayer
                  videoUrl={`${process.env.NEXT_PUBLIC_BASE_URL_VIDEO}${createdItem.video.video.key}`}
                  title={createdItem.title}
                />
              </div>
            )}
            {createdItem.resources?.length > 0 && (
              <div>
                <p className="font-semibold">📄 Tài liệu:</p>
                <ul className="list-disc pl-5">
                  {createdItem.resources.map((res, i) => (
                    <li key={i}>
                      <a
                        href={`${process.env.NEXT_PUBLIC_BASE_URL_DOCUMENT}${res.resource_file.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-LavenderIndigo/80 hover:underline"
                      >
                        {res.resource_file.id?.split("/").pop()}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p>
              <strong className="text-eerieBlack dark:text-white/80">
                Xem trước:
              </strong>{" "}
              {createdItem.is_preview ? "✅ Có" : "❌ Không"}
            </p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit(handleAddCourseItem)}
        className="space-y-6 py-4"
      >
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <InputRegisterLecture
              {...field}
              labelText={`Tiêu đề bài ${
                (section.items?.length || 0) + 1
              } (Phần ${section.position})`}
              error={errors.title?.message}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextAreaRegisterLecture
              {...field}
              labelText={`Nội dung bài ${
                (section.items?.length || 0) + 1
              } (Phần ${section.position})`}
              error={errors.description?.message}
            />
          )}
        />

        <Controller
          name="video"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <InputRegisterLecture
                {...field}
                error={errors.video?.message}
                labelText={`Video bài ${
                  (section.items?.length || 0) + 1
                } (Phần ${section.position})`}
                type="file"
                accept="video/*"
                disabled={isVideoUploading}
                onChange={async (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    await handleVideoUpload(file);
                  }
                }}
              />

              {isVideoUploading && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Đang tải lên video...</span>
                  </div>
                  <Progress value={videoUploadProgress} className="h-2" />
                  <p className="text-sm text-gray-500">
                    {videoUploadProgress}%
                  </p>
                </div>
              )}

              {videoPreview && !isVideoUploading && (
                <VideoPlayer videoUrl={videoPreview} title="Video Preview" />
              )}
            </div>
          )}
        />

        <Controller
          name="resources"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <InputRegisterLecture
                {...field}
                labelText="Tài liệu bài giảng"
                type="file"
                accept=".pdf,.doc,.docx"
                multiple
                disabled={uploadingDocuments.length > 0}
                onChange={async (e) => {
                  const files = Array.from(
                    (e.target as HTMLInputElement).files || []
                  );
                  if (files.length > 0) {
                    await handleDocumentUpload(files, field);
                  }
                }}
              />

              {uploadingDocuments.map((fileName) => (
                <div key={fileName} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Đang tải lên {fileName}...</span>
                  </div>
                  <Progress
                    value={documentUploadProgress[fileName] || 0}
                    className="h-2"
                  />
                  <p className="text-sm text-gray-500">
                    {documentUploadProgress[fileName] || 0}%
                  </p>
                </div>
              ))}

              {documentPreviews.length > 0 && (
                <div>
                  <p className="font-medium">📎 Tài liệu đã tải lên:</p>
                  <ul className="list-disc pl-5">
                    {documentPreviews.map((doc, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-LavenderIndigo/80 hover:underline"
                        >
                          {doc.name}
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedPreviews = documentPreviews.filter(
                              (_, i) => i !== index
                            );
                            setDocumentPreviews(updatedPreviews);

                            const currentResources = field.value || [];
                            const updatedResources = currentResources.filter(
                              (_, i) => i !== index
                            );
                            field.onChange(updatedResources);
                          }}
                          className="text-redPigment ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        />

        <Controller
          name="is_preview"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_preview"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="accent-majorelleBlue w-4 h-4"
              />
              <label htmlFor="is_preview" className="text-sm">
                Cho phép xem trước
              </label>
            </div>
          )}
        />

        <div className="flex gap-2">
          <Button
            type="submit"
            className="bg-custom-gradient-button-violet rounded-lg dark:bg-custom-gradient-button-blue hover:brightness-125 text-white"
          >
            <img
              src="/icons/icon_save.png"
              alt="save"
              className="w-5 h-5 object-fill"
            />
            Lưu
          </Button>

          <Button
            type="button"
            className="bg-redPigment text-white hover:text-white dark:hover:text-black"
            variant="outline"
            onClick={onCancel}
          >
            Hủy
          </Button>
        </div>

        {showAlertSuccess && <AlertSuccess description={description} />}
        {showAlertError && <AlertError description={description} />}
      </form>
    </div>
  );
};

export default CourseItemForm;
