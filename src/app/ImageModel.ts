export interface ImageModel {
  id: number;
  name: string;
  type: string;
  ownerId: number;
  picByte: any;
  description: string;
  commentsCount: number;
  likesCount: number;
  isLiked: boolean;
  index: number;
}
