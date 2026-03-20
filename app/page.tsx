"use client";

import { useState } from "react";
import { Layout, Typography } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import { PhotoUpload } from "@/components/photo-upload";
import { PhotoGallery } from "@/components/photo-gallery";

const { Header, Content } = Layout;
const { Title } = Typography;

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content className="p-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-8">
          <PhotoUpload onUploadSuccess={handleUploadSuccess} />

          <div>
            <Title level={3} className="!text-gray-900 !mb-4">
              All Photos
            </Title>
            <PhotoGallery refreshKey={refreshKey} />
          </div>
        </div>
      </Content>
    </Layout>
  );
}
