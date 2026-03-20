"use client";

import useSWR from "swr";
import { Spin, Empty } from "antd";
import { PhotoCard } from "./photo-card";
import type { PhotoWithComments } from "@/lib/db";
import { apiService } from "@/services/api";

interface PhotoGalleryProps {
  refreshKey: number;
}

export function PhotoGallery({ refreshKey }: PhotoGalleryProps) {
  const { data, error, isLoading, mutate } = useSWR(
    [`/api/photos`, refreshKey],
    () => apiService.getPhotos(refreshKey)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load photos. Please try again.
      </div>
    );
  }

  if (!data?.photos || data.photos.length === 0) {
    return (
      <Empty
        description="No photos yet. Upload your first photo!"
        className="py-20"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          onCommentAdded={() => mutate()}
        />
      ))}
    </div>
  );
}
