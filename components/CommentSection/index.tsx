'use client';

import { useState } from 'react';
import { Avatar, Button, Empty, Input, Spin, Typography, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { CommentType } from '@/types';
import { createComment, getComments } from '@/services/APIs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface CommentSectionProps {
  postId: number;
  comments?: CommentType[];
}

const CommentSection = ({ postId, comments = [] }: CommentSectionProps) => {
  const [value, setValue] = useState('');
  const queryClient = useQueryClient();
  const { data: commentList = [], isFetching } = useQuery<CommentType[]>({
    queryKey: ['comments', postId],
    queryFn: async () => (await getComments({ postId })) ?? [],
    initialData: comments,
  });

  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      message.success('Comment added successfully');
      setValue('');
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
    onError: () => {
      message.error('Failed to add comment');
    },
  });

  const handleAddComment = async () => {
    const trimmedContent = value.trim();
    if (!trimmedContent) {
      message.warning('Type comment');
      return;
    }

    try {
      await createCommentMutation.mutateAsync({ postId, content: trimmedContent });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-4">
      {isFetching ? (
        <div className="flex justify-center py-4">
          <Spin size="small" />
        </div>
      ) : commentList.length === 0 ? (
        <Typography.Text className="text-center block mb-4" type="secondary">
          Leave your first comment
        </Typography.Text>
      ) : (
        <div className="flex flex-col gap-3 w-full">
          {commentList.map((comment) => (
            <div key={comment.id} className="flex gap-3 rounded-md border border-gray-200 p-3">
              <Avatar icon={<UserOutlined />} />
              <div className="flex-1 text-sm">
                <div className="text-gray-500 text-xs">
                  {new Date(comment.created_at).toLocaleString()}
                </div>
                <p className="mb-0 mt-1 text-base">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <Input.TextArea
        rows={3}
        value={value}
        placeholder="Write a comment"
        onChange={(event) => setValue(event.target.value)}
        className="mt-3"
      />
      <Button
        type="primary"
        onClick={handleAddComment}
        loading={createCommentMutation.isPending}
        className="mt-2"
      >
        Add Comment
      </Button>
    </div>
  );
};

export default CommentSection;
