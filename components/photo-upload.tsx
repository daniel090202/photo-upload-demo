"use client";

import { useState } from "react";
import { Upload, Input, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { apiService } from "@/services/api";

interface PhotoUploadProps {
  onUploadSuccess: () => void;
}

export function PhotoUpload({ onUploadSuccess }: PhotoUploadProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error("Please select at least one photo to upload");
      return;
    }

    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("file", file.originFileObj as File);
    });
    
    if (title) {
      formData.append("title", title);
    }

    setUploading(true);

    try {
      await apiService.uploadPhotos(formData);

      const count = fileList.length;
      message.success(
        `${count} photo${count > 1 ? "s" : ""} uploaded successfully!`
      );
      setFileList([]);
      setTitle("");
      onUploadSuccess();
    } catch {
      message.error("Failed to upload photos");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-white rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900">Upload a Photo</h2>

      <Input
        placeholder="Photo title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        size="large"
      />

      <Upload
        listType="picture"
        multiple
        fileList={fileList}
        beforeUpload={(file) => {
          const isImage = file.type.startsWith("image/");
          if (!isImage) {
            message.error(`${file.name} is not an image file!`);
            return Upload.LIST_IGNORE;
          }
          setFileList((prev) => [...prev, { ...file, originFileObj: file } as UploadFile]);
          return false;
        }}
        onRemove={(file) => {
          setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
        }}
        accept="image/*"
      >
        <Button icon={<UploadOutlined />}>Select Photos</Button>
      </Upload>

      <Button
        type="primary"
        onClick={handleUpload}
        loading={uploading}
        disabled={fileList.length === 0}
        size="large"
      >
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}
