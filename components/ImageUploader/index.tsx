'use client';
import { useState } from 'react';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Image, Upload, message } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { uploadFile } from '@/services/utils';
import { createPost } from '@/services/APIs';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const ImageUploader = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const queryClient = useQueryClient();
  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      message.success('Post created successfully');
      setFileList([]);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: () => {
      message.error('Failed to create post');
    },
  });

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const validateBeforeUpload = (file: FileType) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error(`${file.name} is not an image file`);
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handlePostImage = async () => {
    try {
      const uploadedUrls = await Promise.all(
        fileList.map(async (file) => {
          if (!file.originFileObj) {
            return null;
          }
          return uploadFile(file.originFileObj as FileType);
        }),
      );

      const imageUrls = uploadedUrls.filter(Boolean) as string[];

      if (imageUrls.length === 0) {
        message.warning('Please select at least one image');
        return;
      }

      await createPostMutation.mutateAsync({ imageUrls });
    } catch (error) {
      console.log(error);
      message.error('Failed to upload images');
    }
  };

  return (
    <>
      <Upload
        listType="picture-circle"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        multiple={true}
        beforeUpload={validateBeforeUpload}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          alt="preview"
          styles={{ root: { display: 'none' } }}
          preview={{
            open: previewOpen,
            onOpenChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
      <Button
        className="my-3 min-w-30"
        type="primary"
        shape="round"
        icon={<UploadOutlined />}
        size="large"
        onClick={handlePostImage}
        loading={createPostMutation.isPending}
      >
        Post
      </Button>
    </>
  );
};

export default ImageUploader;
