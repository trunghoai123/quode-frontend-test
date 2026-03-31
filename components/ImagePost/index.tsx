'use client';
import { PostType } from '@/types';
import { Card, Carousel } from 'antd';
import { getPosts } from '@/services/APIs';
import { useQuery } from '@tanstack/react-query';
import CommentSection from '@/components/CommentSection';

const ImagePost = () => {
  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery<PostType[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await getPosts();
      if (Array.isArray(res)) {
        return res;
      }
      if (Array.isArray(res?.data)) {
        return res.data;
      }
      return [];
    },
  });

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  if (isError) {
    return <div>Failed to load posts.</div>;
  }

  return (
    <>
      {posts.map((post) => (
        <Card
          key={post.id}
          title={`Post ${post.id}`}
          variant="borderless"
          style={{ marginBottom: '26px' }}
          className="w-full mb-3 pb-4"
        >
          <Carousel arrows infinite>
            {post.image_urls.map((url, index) => (
              <div key={index}>
                <img
                  src={url}
                  alt={`Post ${post.id} Image ${index + 1}`}
                  className="w-full h-80 object-cover"
                />
              </div>
            ))}
          </Carousel>
          <CommentSection postId={post.id} comments={post.comments} />
        </Card>
      ))}
    </>
  );
};

export default ImagePost;
